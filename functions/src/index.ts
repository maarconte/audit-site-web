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

		// 🛡️ SECURITY: Prevent Mass Assignment/IDOR by ignoring `listIds` from user input
		// We only extract the fields we explicitly expect and validate them
		const {
			email,
			firstName,
			lastName,
			url,
			scores,
		} = req.body as SubmitFormBody;

		// 🛡️ SECURITY: Strict input validation for type and length limits
		if (
			typeof email !== "string" || email.length > 255 ||
			typeof firstName !== "string" || firstName.length > 100 ||
			typeof lastName !== "string" || lastName.length > 100 ||
			(url !== undefined && (typeof url !== "string" || url.length > 500))
		) {
			res
				.status(400)
				.json({ success: false, message: "Format de données invalide." });
			return;
		}

		// 🛡️ SECURITY: Basic email regex validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res
				.status(400)
				.json({ success: false, message: "Format d'email invalide." });
			return;
		}

		if (!email || !firstName || !lastName) {
			res
				.status(400)
				.json({ success: false, message: "Tous les champs sont requis." });
			return;
		}

		// 🛡️ SECURITY: Hardcode the destination list ID to prevent unauthorized subscriptions
		const finalLists = [5];

		try {
			// 1. Save to Firestore
			const collectionName =
				process.env.FIREBASE_COLLECTION_SUBMISSIONS || "submissions";
			await db.collection(collectionName).add({
				firstName,
				lastName,
				email,
				url: url || "",
				scores: scores || {},
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
				// 🛡️ SECURITY: Sanitize error logs to prevent PII/internal context leakage
				console.error("Brevo Error Response:", {
					code: errorData.code,
					message: errorData.message,
				});
				res
					.status(500)
					.json({
						success: false,
						message: "Erreur lors de l'ajout à la newsletter.",
					});
			}
		} catch (error) {
			// 🛡️ SECURITY: Log only safe error messages instead of full stack traces
			console.error("Submission Error (Firebase/Brevo):", error instanceof Error ? error.message : "Unknown error");
			res
				.status(500)
				.json({
					success: false,
					message: "Erreur lors de la soumission de l'évaluation.",
				});
		}
	}
);
