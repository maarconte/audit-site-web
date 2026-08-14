"use client";

import React from "react";

import { oublierChoixConsentement } from "@/utils/analytics";

/**
 * Lien de pied de page permettant de revenir sur son choix de mesure.
 *
 * Le RGPD demande que retirer son consentement soit aussi simple que de le
 * donner. Sans ce lien, un visiteur ayant repondu une fois n'avait aucun
 * moyen de changer d'avis, la banniere ne se reaffichant jamais.
 *
 * Effacer le choix notifie les abonnes : la banniere revient immediatement,
 * sans rechargement.
 */
export default function ConsentSettingsLink() {
  return (
    <button
      type="button"
      onClick={oublierChoixConsentement}
      className="btn btn-link btn-sm text-white p-0"
    >
      <small>Gérer mes préférences de mesure</small>
    </button>
  );
}
