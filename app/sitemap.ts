import type { MetadataRoute } from "next";

// Requis par "output: export" : le sitemap est genere une fois au build.
export const dynamic = "force-static";

// Duplique ici plutot qu'importe de src/lib/site.ts (REF-17, PR #117, pas
// encore mergee dans develop au moment de ce ticket) pour ne pas rendre REF-18
// dependant d'une branche non fusionnee. A remplacer par l'import partage une
// fois REF-17 en ligne.
const SITE_ORIGIN = "https://thatmuch.fr";
const BASE_PATH = "/audit-refonte";

/**
 * lastModified est volontairement omis : aucune des deux pages n'a de date de
 * derniere modification reellement suivie (pas de CMS, pas de champ "updatedAt"),
 * et Google recommande de ne declarer lastmod que si la valeur reflete un vrai
 * changement de contenu.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${SITE_ORIGIN}${BASE_PATH}`;

  // trailingSlash: true (next.config.ts) : les URLs canoniques reelles se
  // terminent par "/", le sitemap doit les reprendre a l'identique.
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/refonte-form/`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
