"use client";

import { EVENEMENTS, suivre } from "@/utils/analytics";

import React from "react";

/** Lien de reservation HubSpot Meetings, unique point de verite du produit. */
export const LIEN_RDV = "https://meetings-eu1.hubspot.com/mathilde-arconte";

type Props = {
  /**
   * Identifie le point de sortie. Remonte tel quel dans meeting_link_clicked,
   * ce qui permet de comparer les emplacements entre eux — c'est tout l'objet
   * du ticket : savoir lequel convertit.
   */
  emplacement: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * CTA de prise de rendez-vous.
 *
 * Le tunnel se terminait sur « regardez vos mails » : le produit ne demandait
 * jamais de rendez-vous, le seul lien vivait dans le mail de restitution.
 *
 * Le libelle est passe en children a dessein — il doit parler du benefice et
 * s'adapter au contexte. Sur la page d'accueil le visiteur n'a pas encore de
 * score, promettre de le relire n'aurait aucun sens.
 */
export default function MeetingCta({
  emplacement,
  children,
  className,
}: Props) {
  return (
    <a
      href={LIEN_RDV}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "btn btn-primary"}
      onClick={() => suivre(EVENEMENTS.lienRdvClique, { emplacement })}
    >
      {children}
    </a>
  );
}
