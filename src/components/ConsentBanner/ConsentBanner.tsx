"use client";

import React, { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  accepterMesure,
  lireConsentement,
  refuserMesure,
  restaurerConsentement,
  sAbonnerAuConsentement,
} from "@/utils/analytics";

/**
 * Bandeau de consentement a la mesure d'audience.
 *
 * Il s'affiche tant que l'utilisateur n'a pas repondu, et conditionne
 * l'initialisation de Firebase Analytics : sans acceptation, aucun cookie de
 * mesure n'est pose et aucun evenement ne part.
 *
 * Volontairement sobre : deux choix explicites et de meme poids visuel. Un
 * refus rendu plus difficile que l'acceptation n'est pas un consentement
 * libre.
 */
export default function ConsentBanner() {
  // Le rendu est statique : le choix stocke ne peut etre lu que cote
  // navigateur. useSyncExternalStore evite le setState dans un effet et
  // garantit un instantane serveur stable, donc pas d'ecart d'hydratation.
  const choix = useSyncExternalStore(
    sAbonnerAuConsentement,
    lireConsentement,
    () => false as const,
  );

  useEffect(() => {
    // Un consentement donne lors d'une visite precedente doit rebrancher la
    // mesure au chargement, sans reafficher la banniere.
    if (choix === true) restaurerConsentement();
  }, [choix]);

  const repondre = useCallback((accepte: boolean) => {
    if (accepte) {
      accepterMesure();
    } else {
      refuserMesure();
    }
  }, []);

  // null = pas encore repondu. false = refus assume, on n'insiste pas.
  if (choix !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement à la mesure d'audience"
      className="position-fixed bottom-0 start-0 end-0 p-3 bg-dark text-white"
      style={{ zIndex: 1080 }}
    >
      <div className="container-fluid d-flex flex-column flex-md-row align-items-md-center gap-3 no-animation">
        <p className="mb-0 flex-grow-1  opacity-25">
          <small>
            Nous mesurons la façon dont cet outil est utilisé, pour l’améliorer.
            Aucune donnée n’est collectée sans votre accord. Voir notre{" "}
            {/* <a> brute volontairement : la page vit sur thatmuch.fr, hors basePath. */}
            <a
              href="/politique-de-confidentialite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-underline"
            >
              politique de confidentialité
            </a>
            .
          </small>
        </p>
        <div className="d-flex gap-2 flex-shrink-0">
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => repondre(false)}
          >
            Refuser
          </button>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => repondre(true)}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
