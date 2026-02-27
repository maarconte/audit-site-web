import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const brevoApiKey = defineSecret("BREVO_API_KEY");

interface SubmitFormBody {
	email: string;
	firstName: string;
	lastName: string;
	url?: string;
	scores?: Record<string, unknown>;
	listIds?: number[];
}

export const submitForm = onRequest(
	{ secrets: [brevoApiKey], cors: true },
	async (req, res) => {
		// Only accept POST
		if (req.method !== "POST") {
			res.status(405).json({ success: false, message: "Method not allowed" });
			return;
		}

		const body = req.body as Partial<SubmitFormBody>;

		// Basic type checking
		if (typeof body.email !== "string" || typeof body.firstName !== "string" || typeof body.lastName !== "string") {
			res.status(400).json({ success: false, message: "Invalid input types." });
			return;
		}

		const email = body.email.trim();
		const firstName = body.firstName.trim();
		const lastName = body.lastName.trim();
		const url = typeof body.url === "string" ? body.url.trim() : "";
		const scores = body.scores || {};
		const listIds = body.listIds;

		// Validation
		if (!email || !firstName || !lastName) {
			res
				.status(400)
				.json({ success: false, message: "Tous les champs sont requis." });
			return;
		}

		// Length validation
		if (firstName.length > 100 || lastName.length > 100) {
			res.status(400).json({ success: false, message: "Name fields too long." });
			return;
		}

		if (email.length > 254) {
			res.status(400).json({ success: false, message: "Email too long." });
			return;
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ success: false, message: "Invalid email format." });
			return;
		}

		// URL validation if provided
		if (url) {
			if (url.length > 2000) {
				res.status(400).json({ success: false, message: "URL too long." });
				return;
			}
			try {
				new URL(url);
			} catch {
				res.status(400).json({ success: false, message: "Invalid URL format." });
				return;
			}
		}

		const finalLists =
			listIds && listIds.length > 0 ? listIds : [5];

		try {
			// 1. Save to Firestore
			const collectionName =
				process.env.FIREBASE_COLLECTION_SUBMISSIONS || "submissions";
			await db.collection(collectionName).add({
				firstName,
				lastName,
				email,
				url,
				scores,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			});

			// 2. Submit to Brevo
			const contactData = {
				email,
				attributes: {
					PRENOM: firstName,
					NOM: lastName,
				},
				listIds: finalLists,
				updateEnabled: true,
			};

			const brevoResponse = await fetch(
				"https://api.brevo.com/v3/contacts",
				{
					method: "POST",
					headers: {
						accept: "application/json",
						"api-key": brevoApiKey.value(),
						"content-type": "application/json",
					},
					body: JSON.stringify(contactData),
				}
			);

			if (brevoResponse.ok || brevoResponse.status === 204) {
				res
					.status(200)
					.json({
						success: true,
						message: "Évaluation envoyée avec succès.",
					});
			} else {
				const errorData = await brevoResponse.json();
				console.error("Brevo Error Response:", errorData);
				res
					.status(500)
					.json({
						success: false,
						message: "Erreur lors de l'ajout à la newsletter.",
					});
			}
		} catch (error) {
			console.error("Submission Error (Firebase/Brevo):", error);
			res
				.status(500)
				.json({
					success: false,
					message: "Erreur lors de la soumission de l'évaluation.",
				});
		}
	}
);
