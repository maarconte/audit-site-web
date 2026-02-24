"use server";

export async function submitToBrevo(prevState: any, formData: FormData) {
	const email = formData.get("email") as string;
	const firstName = formData.get("firstName") as string;
	const lastName = formData.get("lastName") as string;
	const listIds = formData.getAll("listIds").map(Number); // Assuming we pass listIds as hidden fields or derive them
	const finalLists = listIds.length > 0 ? listIds : [5]

	if (!email || !firstName || !lastName) {
		return { success: false, message: "Tous les champs sont requis." };
	}

	const apikey = process.env.BREVO_API_KEY;

	if (!apikey) {
		console.error("Missing Brevo API Key on the server");
		return { success: false, message: "Erreur de configuration serveur." };
	}

	const url = formData.get("url") as string;
	const scoresStr = formData.get("scores") as string;
	const scores = scoresStr ? JSON.parse(scoresStr) : {};

	const submissionData = {
		firstName,
		lastName,
		email,
		url,
		scores,
	};

	try {
		// Import Firebase setup
		const { db } = await import("@/utils/firebase");
		const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

		const collectionName = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_SUBMISSIONS || "submissions";
		const collectionRef = collection(db, collectionName);

		// Save to Firebase first
		await addDoc(collectionRef, {
			...submissionData,
			createdAt: serverTimestamp(),
		});
		console.log("Firebase submission successful");

		// Then submit to Brevo
		const contactData = {
			email,
			attributes: {
				PRENOM: firstName,
				NOM: lastName,
			},
			listIds: finalLists,
			updateEnabled: true,
		};

		const response = await fetch("https://api.brevo.com/v3/contacts", {
			method: "POST",
			headers: {
				accept: "application/json",
				"api-key": apikey,
				"content-type": "application/json",
			},
			body: JSON.stringify(contactData),
		});

		if (response.ok || response.status === 204) {
			return { success: true, message: "Évaluation envoyée avec succès." };
		} else {
			const errorData = await response.json();
			console.error("Brevo Error Response:", errorData);
			// Even if Brevo fails, we saved the data in Firebase. Still returning an error so the user knows.
			return { success: false, message: "Erreur lors de l'ajout à la newsletter." };
		}
	} catch (error) {
		console.error("Submission Error (Firebase/Brevo):", error);
		return { success: false, message: "Erreur lors de la soumission de l'évaluation." };
	}
}
