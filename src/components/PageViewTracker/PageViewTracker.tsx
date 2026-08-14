"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { EVENEMENTS, suivre } from "@/utils/analytics";

/**
 * Emet page_view a chaque changement de route.
 *
 * Firebase Analytics collecte automatiquement page_view, mais seulement au
 * chargement initial du document : dans une navigation cote client, passer de
 * la page d'accueil au tunnel ne produit aucun evenement. Sans ca, l'entree
 * dans le tunnel serait invisible dans les rapports.
 */
export default function PageViewTracker() {
  const chemin = usePathname();

  useEffect(() => {
    if (!chemin) return;
    suivre(EVENEMENTS.pageVue, { page_path: chemin });
  }, [chemin]);

  return null;
}
