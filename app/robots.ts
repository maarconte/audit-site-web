import { BASE_PATH, SITE_ORIGIN } from "@/lib/site";
import type { MetadataRoute } from "next";

// Requis par "output: export" : robots.txt est genere une fois au build.
export const dynamic = "force-static";

/**
 * Ce fichier sera servi sous thatmuch.fr/audit-refonte/robots.txt. Aucun robot
 * ne va jamais le lire a cette adresse : le protocole robots.txt n'est
 * consulte qu'a la racine du domaine (thatmuch.fr/robots.txt), qui est
 * generee par gatsby-plugin-robots-txt dans le depot ThatMuch/website — voir
 * la PR https://github.com/ThatMuch/website/pull/84, qui y declare le
 * sitemap de cet outil.
 *
 * Ce fichier reste correct a garder : il documente les regles reelles de
 * l'outil pour quiconque le consulterait directement, et satisfait le critere
 * d'acceptation "out/robots.txt est genere". Mais c'est le robots.txt racine,
 * pas celui-ci, qui gouverne effectivement le crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_ORIGIN}${BASE_PATH}/sitemap.xml`,
  };
}
