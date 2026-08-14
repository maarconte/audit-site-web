import {
	Analytics,
	CustomEventName,
	getAnalytics,
	isSupported,
	logEvent,
	setAnalyticsCollectionEnabled,
} from "firebase/analytics";

import { app } from "./firebase";

/**
 * Instrumentation du tunnel, au-dessus de Firebase Analytics.
 *
 * Deux garanties tenues par ce module :
 *
 * 1. Rien n'est envoye avant consentement. Analytics n'est meme pas
 *    initialise tant que l'utilisateur n'a pas accepte, donc aucun cookie
 *    n'est pose. Les evenements survenus avant le choix sont mis en attente
 *    et ne partent qu'en cas d'acceptation ; un refus les jette.
 * 2. Rien ne casse le rendu. L'export est statique et le code s'execute
 *    aussi cote serveur au build : chaque appel est sans effet hors
 *    navigateur, et isSupported() couvre les environnements ou la mesure
 *    n'est pas disponible.
 */

/** Cle de stockage du choix de l'utilisateur. */
const CLE_CONSENTEMENT = "thatmuch-consentement-mesure";

/**
 * Evenements du tunnel. Les noms sont figes ici pour eviter les fautes de
 * frappe silencieuses : un evenement mal orthographie ne remonte jamais
 * d'erreur, il disparait simplement des rapports.
 */
export const EVENEMENTS = {
	pageVue: "page_view",
	quizDemarre: "quiz_start",
	quizEtapeTerminee: "quiz_step_completed",
	quizTermine: "quiz_completed",
	formulaireContactVu: "contact_form_viewed",
	leadEnvoye: "lead_submitted",
	resultatVu: "result_viewed",
	lienRdvClique: "meeting_link_clicked",
} as const;

type NomEvenement = (typeof EVENEMENTS)[keyof typeof EVENEMENTS];
type Parametres = Record<string, string | number | boolean>;

/**
 * page_view est un nom reserve par GA4, avec sa propre surcharge de types dans
 * le SDK. Passer une union qui le contient ne resout aucune surcharge : on
 * emprunte donc explicitement la voie des evenements personnalises, dont la
 * signature accepte des parametres libres.
 */
function envoyer(cible: Analytics, nom: NomEvenement, params: Parametres) {
	logEvent(cible, nom as CustomEventName<NomEvenement>, params);
}

let analytics: Analytics | null = null;
let consentementAccorde = false;
let fileDAttente: Array<{ nom: NomEvenement; params: Parametres }> = [];

/** Lit le choix deja fait, ou null si l'utilisateur n'a pas encore repondu. */
export function lireConsentement(): boolean | null {
	if (typeof window === "undefined") return null;
	try {
		const brut = window.localStorage.getItem(CLE_CONSENTEMENT);
		if (brut === "accepte") return true;
		if (brut === "refuse") return false;
		return null;
	} catch {
		// Mode navigation privee ou stockage bloque : on considere que rien
		// n'a ete choisi, la banniere se reaffichera.
		return null;
	}
}

function memoriser(choix: "accepte" | "refuse") {
	try {
		window.localStorage.setItem(CLE_CONSENTEMENT, choix);
	} catch {
		// Sans stockage, le choix ne vaut que pour la session en cours.
	}
	for (const abonne of abonnes) abonne();
}

/** Abonnes a notifier quand le choix change, pour useSyncExternalStore. */
const abonnes = new Set<() => void>();

/**
 * S'abonne aux changements de consentement.
 *
 * `lireConsentement` sert d'instantane : elle ne renvoie que des primitives
 * (true, false ou null), donc React peut les comparer sans risque de boucle.
 */
export function sAbonnerAuConsentement(surChangement: () => void) {
	abonnes.add(surChangement);
	return () => {
		abonnes.delete(surChangement);
	};
}

/** Initialise Analytics puis vide la file d'attente. */
async function demarrerMesure() {
	if (analytics || typeof window === "undefined") return;

	if (!(await isSupported())) {
		fileDAttente = [];
		return;
	}

	analytics = getAnalytics(app);
	const enAttente = fileDAttente;
	fileDAttente = [];
	for (const { nom, params } of enAttente) {
		envoyer(analytics, nom, params);
	}
}

/** L'utilisateur accepte la mesure : on demarre et on envoie l'attente. */
export function accepterMesure() {
	consentementAccorde = true;
	if (analytics) setAnalyticsCollectionEnabled(analytics, true);
	memoriser("accepte");
	void demarrerMesure();
}

/** L'utilisateur refuse : la file est jetee, rien ne partira. */
export function refuserMesure() {
	consentementAccorde = false;
	fileDAttente = [];
	// Si la mesure avait ete acceptee puis retiree, le SDK est deja charge :
	// il faut le faire taire explicitement, sans quoi il continuerait a
	// collecter jusqu'au prochain rechargement.
	if (analytics) setAnalyticsCollectionEnabled(analytics, false);
	memoriser("refuse");
}

/**
 * Efface le choix : la banniere se reaffiche et la mesure s'arrete en
 * attendant une nouvelle reponse.
 *
 * Retirer son consentement doit etre aussi simple que de le donner ; c'est
 * aussi ce qui permet de retester la banniere sans vider le stockage a la main.
 */
export function oublierChoixConsentement() {
	consentementAccorde = false;
	fileDAttente = [];
	if (analytics) setAnalyticsCollectionEnabled(analytics, false);
	try {
		window.localStorage.removeItem(CLE_CONSENTEMENT);
	} catch {
		// Sans stockage, le choix n'avait de toute facon pas ete persiste.
	}
	for (const abonne of abonnes) abonne();
}

/** Restaure un consentement donne lors d'une visite precedente. */
export function restaurerConsentement() {
	if (lireConsentement() === true) {
		consentementAccorde = true;
		void demarrerMesure();
	}
}

/**
 * Enregistre un evenement. Sans consentement, il est mis de cote : il ne
 * partira que si l'utilisateur accepte pendant cette visite.
 */
export function suivre(nom: NomEvenement, params: Parametres = {}) {
	if (typeof window === "undefined") return;

	if (!consentementAccorde) {
		// Plafond volontaire : au-dela, l'utilisateur n'a manifestement pas
		// repondu a la banniere et rien ne justifie de tout garder en memoire.
		if (fileDAttente.length < 30) fileDAttente.push({ nom, params });
		return;
	}

	if (!analytics) {
		void demarrerMesure();
		if (fileDAttente.length < 30) fileDAttente.push({ nom, params });
		return;
	}

	envoyer(analytics, nom, params);
}
