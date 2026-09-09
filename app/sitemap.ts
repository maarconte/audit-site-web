import { BASE_PATH, SITE_ORIGIN } from "@/lib/site";
import type { MetadataRoute } from "next";

// Requis par "output: export" : le sitemap est genere une fois au build.
export const dynamic = "force-static";

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
