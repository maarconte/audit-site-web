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

		const {
			email,
			firstName,
			lastName,
			url,
			scores,
			listIds,
		} = req.body as SubmitFormBody;

		// Validation
		if (!email || !firstName || !lastName) {
			res
				.status(400)
				.json({ success: false, message: "Tous les champs sont requis." });
			return;
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
