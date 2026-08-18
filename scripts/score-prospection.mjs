#!/usr/bin/env node
/**
 * Recalcule le TOTAL des prospects de prospects.json sur le denominateur
 * reduit (maximums_externe), pas sur 100.
 *
 * Le quiz declaratif suppose que le repondant connait ses propres intentions
 * (marketing-1/2/3 : branding, offre, envie d'ajouter des pages) — un analyste
 * externe qui remplit le quiz a la place du prospect ne peut pas les observer
 * sans le contacter. Le formulaire ne permet pas non plus de repondre a une
 * seule question du bloc marketing isolement : impossible donc de ne garder
 * que marketing-4 (observable). MARKETING est donc entierement absente de
 * maximums_externe (pas juste plafonnee), et le TOTAL est recalcule sur 85
 * (somme des 6 categories restantes) au lieu de 100.
 *
 * Usage : node scripts/score-prospection.mjs [prospects.json]
 */

import { readFileSync, writeFileSync } from "node:fs";

const fichier = process.argv[2] ?? "prospects.json";
const data = JSON.parse(readFileSync(fichier, "utf8"));

const MAX = data.maximums_externe;
if (!MAX) {
  throw new Error(`${fichier} n'a pas de bloc "maximums_externe"`);
}
const categories = Object.keys(MAX);
const maxEffectif = categories.reduce((s, c) => s + MAX[c], 0);

let erreurs = 0;
console.log(
  `Denominateur externe : ${maxEffectif}/100 sur ${categories.join(", ")} ` +
    `(MARKETING exclue — cf. _lisezmoi)\n`
);

for (const prospect of data.prospects) {
  const attrs = prospect.contact.attributes;

  const depassements = categories.filter((c) => Number(attrs[c] ?? 0) > MAX[c]);
  if (depassements.length > 0) {
    erreurs += depassements.length;
    console.error(
      `⚠️  ${prospect.nom} : ${depassements
        .map((c) => `${c}=${attrs[c]} > max observable ${MAX[c]}`)
        .join(", ")}`
    );
  }

  const brut = categories.reduce((s, c) => s + Number(attrs[c] ?? 0), 0);
  attrs.TOTAL = brut;

  const pct = maxEffectif > 0 ? Math.round((brut / maxEffectif) * 100) : 0;
  console.log(
    `${prospect.nom.padEnd(22)} TOTAL=${String(brut).padStart(3)}/${maxEffectif}` +
      `  (${String(pct).padStart(3)}%)`
  );
}

writeFileSync(fichier, JSON.stringify(data, null, 2) + "\n");

if (erreurs > 0) {
  console.error(
    `\n${erreurs} depassement(s) : une categorie note au-dela de ce qui est observable ` +
      `de l'exterieur (probablement marketing-1/2/3 devine plutot qu'observe).`
  );
  process.exit(1);
}
console.log(`\n${data.prospects.length} prospects, TOTAL recalcule et ecrit dans ${fichier}.`);
