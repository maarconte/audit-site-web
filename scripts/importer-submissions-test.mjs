#!/usr/bin/env node
/**
 * Importe les scores de la collection Firestore submissions-test dans
 * prospects.json, en matchant par URL.
 *
 * Ne lit pas Firestore directement (ce script n'a pas d'identifiants Google
 * Cloud) : il consomme un dump JSON de la collection, au format renvoye par
 * le MCP Firebase (firestore_query_collection) ou `firebase firestore:get`.
 * Rafraichir .firestore-submissions-test.json avant de relancer.
 *
 * Importe aussi le contact soumis : Firestore stocke le prenom sous firstName
 * (pas PRENOM), voir functions/src/index.ts. Certaines soumissions de
 * submissions-test sont des tests de l'outil par l'equipe elle-meme (alias
 * +test@, faux nom) : verifier le contact importe avant d'envoyer un mail.
 *
 * Usage : node scripts/importer-submissions-test.mjs [dump.json] [prospects.json]
 */

import { readFileSync, writeFileSync } from "node:fs";

const dumpPath = process.argv[2] ?? ".firestore-submissions-test.json";
const prospectsPath = process.argv[3] ?? "prospects.json";

const submissions = JSON.parse(readFileSync(dumpPath, "utf8"));
const data = JSON.parse(readFileSync(prospectsPath, "utf8"));

// slug (Cloud Function / questionquiz.json) -> attribut contact (Brevo / prospects.json)
const SLUG_VERS_ATTR = {
  design: "DESIGN",
  marketing: "MARKETING",
  ux: "UX",
  seo: "SEO",
  performance: "PERFORMANCE",
  technique: "TECH",
  legal: "LEGAL",
};

const normaliser = (url) =>
  (url || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");

let importes = 0;
let nonApparies = 0;

for (const soumission of submissions) {
  const cible = normaliser(soumission.url);
  const prospect = data.prospects.find(
    (p) => normaliser(p.contact.attributes.URL) === cible
  );

  if (!prospect) {
    nonApparies++;
    console.warn(`⚠️  Aucun prospect ne correspond a l'URL : ${soumission.url}`);
    continue;
  }

  const attrs = prospect.contact.attributes;
  for (const [slug, attr] of Object.entries(SLUG_VERS_ATTR)) {
    if (soumission.scores?.[slug] !== undefined) {
      attrs[attr] = soumission.scores[slug];
    }
  }

  if (soumission.firstName) attrs.PRENOM = soumission.firstName;
  if (soumission.lastName) attrs.NOM = soumission.lastName;
  if (soumission.email) prospect.contact.email = soumission.email;

  if (prospect.statut === "a_analyser") {
    prospect.statut = "analyse";
  }

  console.log(`✅ ${prospect.nom} <- ${soumission.__path__ ?? soumission.url}`);
  if (attrs.MARKETING > 0) {
    console.log(
      `   ℹ️  MARKETING=${attrs.MARKETING} importe a titre informatif, exclu du TOTAL ` +
        `(cf. _lisezmoi de prospects.json, le formulaire ne permet pas de repondre ` +
        `qu'a marketing-4).`
    );
  }
  console.log(
    `   Contact importe (a verifier avant envoi, souvent un test interne) : ` +
      `${attrs.PRENOM || "?"} ${attrs.NOM || "?"} <${prospect.contact.email || "?"}>`
  );

  importes++;
}

writeFileSync(prospectsPath, JSON.stringify(data, null, 2) + "\n");

console.log(
  `\n${importes} soumission(s) importee(s), ${nonApparies} non appariee(s) — ` +
    `${prospectsPath} mis a jour.`
);
if (importes > 0) {
  console.log(`Lancer node scripts/score-prospection.mjs pour recalculer les TOTAL.`);
}
