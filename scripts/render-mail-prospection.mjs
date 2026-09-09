#!/usr/bin/env node
/**
 * Genere un mail texte brut personnalise par prospect (P2-9), a partir de
 * mail-prospection.txt et prospects.json — pas le template HTML/Liquid de
 * codeEmailBrevo.html (celui-ci reste pour le flux declaratif visiteur).
 *
 * prospect.constat_cout (optionnel) remplace la phrase generique sur le cout
 * du probleme (COUT_DEFAUT) quand le constat_personnalise n'est pas du genre
 * "visiteur qui hesite et ferme l'onglet" (ex: probleme de securite, de SEO
 * pur, etc.) — sinon la phrase du gabarit ne colle pas au constat.
 *
 * Le score affiche est recalcule ici avec la meme logique que
 * scripts/score-prospection.mjs (categories de maximums_externe, MARKETING
 * exclue, denominateur 85 rescale sur 100) plutot que relu depuis TOTAL —
 * au cas ou score-prospection.mjs n'a pas encore ete relance apres une
 * modification manuelle des scores.
 *
 * Usage : node scripts/render-mail-prospection.mjs [dossier-de-sortie] [fichier]
 * Sortie par defaut : .prospects-mail/ (ignore par git)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Source de verite : src/components/MeetingCta/MeetingCta.tsx (export LIEN_RDV).
// Duplique ici car ce script tourne en JS brut hors build Next/TS.
const LIEN_RDV = "https://meetings-eu1.hubspot.com/mathilde-arconte";

// Phrase generique sur le cout du probleme, utilisee si le prospect n'a pas
// de constat_cout sur mesure dans prospects.json.
const COUT_DEFAUT =
  "Ça paraît anodin, mais ça coûte des clients sans qu'on s'en aperçoive : un visiteur qui hésite ferme l'onglet et va voir ailleurs, il ne cherche pas plus loin.";

const outDir = process.argv[2] ?? ".prospects-mail";
const fichierSource = process.argv[3] ?? "prospects.json";
mkdirSync(outDir, { recursive: true });

const gabarit = readFileSync("mail-prospection.txt", "utf8");
const data = JSON.parse(readFileSync(fichierSource, "utf8"));

const MAX = data.maximums_externe;
if (!MAX) {
  throw new Error(`${fichierSource} n'a pas de bloc "maximums_externe"`);
}
const categories = Object.keys(MAX);
const maxEffectif = categories.reduce((s, c) => s + MAX[c], 0);

let generes = 0;
let sansConstat = 0;

for (const prospect of data.prospects) {
  const attrs = prospect.contact.attributes;
  const constat = prospect.constat_personnalise?.trim();

  if (!constat) {
    sansConstat++;
    console.log(`⏭️  ${prospect.nom.padEnd(22)} pas de constat_personnalise — mail non genere`);
    continue;
  }

  const salutation = attrs.PRENOM ? `Bonjour ${attrs.PRENOM},` : "Bonjour,";
  const brut = categories.reduce((s, c) => s + Number(attrs[c] ?? 0), 0);
  const score = Math.round((brut / maxEffectif) * 100);
  const cout = prospect.constat_cout?.trim() || COUT_DEFAUT;

  const texte = gabarit
    .replaceAll("{{ENTREPRISE}}", prospect.entreprise)
    .replaceAll("{{SALUTATION}}", salutation)
    .replaceAll("{{SCORE}}", String(score))
    .replaceAll("{{CONSTAT}}", constat)
    .replaceAll("{{COUT}}", cout)
    .replaceAll("{{LIEN_OUTIL}}", prospect.lien)
    .replaceAll("{{LIEN_RDV}}", LIEN_RDV);

  writeFileSync(join(outDir, `${prospect.nom}.txt`), texte, "utf8");
  generes++;
  console.log(`✅ ${prospect.nom.padEnd(22)} -> ${outDir}/${prospect.nom}.txt`);
}

console.log(
  `\n${generes} mail(s) genere(s) dans ${outDir}/` +
    (sansConstat > 0 ? `, ${sansConstat} prospect(s) sans constat_personnalise ignore(s).` : ".")
);
