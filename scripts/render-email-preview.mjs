#!/usr/bin/env node
/**
 * Rend codeEmailBrevo.html hors de Brevo, pour visualiser le mail sans envoi.
 *
 * Ne gere que le sous-ensemble Liquid reellement utilise par le template :
 *   {{ contact.X }}                         substitution
 *   {% if contact.X >= n %} ... {% endif %} condition simple
 *   {% if a and b %}                        conjonction de deux comparaisons
 *
 * Usage : node scripts/render-email-preview.mjs [dossier-de-sortie]
 * Sortie par defaut : .email-preview/ (ignore par git)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const template = readFileSync("codeEmailBrevo.html", "utf8");
const outDir = process.argv[2] ?? ".email-preview";
mkdirSync(outDir, { recursive: true });

/**
 * Profils et maximums viennent de tests/fixtures/profils-email.json, qui sert aussi
 * de jeu de contacts de test pour Brevo. Un seul endroit a maintenir.
 */
const fixture = JSON.parse(
  readFileSync("tests/fixtures/profils-email.json", "utf8")
);
const MAX = fixture.maximums;
const profils = fixture.profils;

/** Evalue une comparaison unique du type "contact.X >= 12". */
function comparer(expr, attrs) {
  const m = expr.trim().match(/^contact\.([A-Z_]+)\s*(>=|<=|>|<|==)\s*(-?\d+)$/);
  if (!m) throw new Error("expression Liquid non geree : " + expr);
  const [, attr, op, brut] = m;
  const gauche = Number(attrs[attr] ?? 0);
  const droite = Number(brut);
  switch (op) {
    case ">=": return gauche >= droite;
    case "<=": return gauche <= droite;
    case ">": return gauche > droite;
    case "<": return gauche < droite;
    case "==": return gauche === droite;
  }
}

/** Evalue une condition, avec au plus un "and". */
function evaluer(condition, attrs) {
  return condition
    .split(/\s+and\s+/)
    .every((partie) => comparer(partie, attrs));
}

/**
 * Resout les {% if %}...{% endif %} en partant des blocs les plus internes,
 * ce qui evite d'avoir a construire un arbre : le template n'imbrique jamais
 * deux conditions sur le meme attribut.
 */
function resoudreConditions(html, attrs) {
  const bloc = /\{%\s*if\s+([^%]+?)\s*%\}((?:(?!\{%\s*if\s)[\s\S])*?)\{%\s*endif\s*%\}/;
  let sortie = html;
  let garde = 0;
  while (bloc.test(sortie)) {
    if (++garde > 500) throw new Error("boucle de resolution non convergente");
    sortie = sortie.replace(bloc, (_, condition, corps) =>
      evaluer(condition, attrs) ? corps : ""
    );
  }
  return sortie;
}

function rendre(attrs) {
  const total = Object.keys(MAX).reduce((s, k) => s + Number(attrs[k] ?? 0), 0);
  const complet = { ...attrs, TOTAL: total };
  let html = resoudreConditions(template, complet);
  html = html.replace(/\{\{\s*contact\.([A-Z_]+)\s*\}\}/g, (_, k) =>
    String(complet[k] ?? "")
  );
  return { html, total };
}

/** Branche de message attendue pour un TOTAL, d'apres les seuils du template. */
const brancheAttendue = (total) =>
  total >= 66 ? "haute" : total > 33 ? "mediane" : "basse";

const index = [];
let erreurs = 0;
for (const profil of profils) {
  const { html, total } = rendre(profil.contact.attributes);
  const fichier = `${profil.nom}.html`;
  writeFileSync(join(outDir, fichier), html, "utf8");

  const restes = (html.match(/\{%|\{\{/g) || []).length;
  const boutons = (html.match(/meetings-eu1/g) || []).length;

  // Le TOTAL du contact Brevo est ecrit a la main dans la fixture : verifier qu'il
  // vaut bien la somme des categories, sinon le contact de test ment sur son score.
  const ecrits = [];
  if (total !== profil.totalAttendu) {
    ecrits.push(`somme=${total} mais totalAttendu=${profil.totalAttendu}`);
  }
  if (Number(profil.contact.attributes.TOTAL) !== total) {
    ecrits.push(`attribut TOTAL=${profil.contact.attributes.TOTAL} mais somme=${total}`);
  }
  if (brancheAttendue(total) !== profil.branche) {
    ecrits.push(`branche=${profil.branche} mais ${total} tombe en ${brancheAttendue(total)}`);
  }
  if (restes > 0) ecrits.push(`${restes} balise(s) Liquid non resolue(s)`);
  if (boutons === 0) ecrits.push("aucun bouton de RDV dans le rendu");

  erreurs += ecrits.length;
  index.push({ fichier, titre: profil.titre, total, restes, boutons });
  console.log(
    `${fichier.padEnd(22)} TOTAL=${String(total).padStart(3)}  ` +
      `branche=${profil.branche.padEnd(8)} boutons RDV=${boutons}  ` +
      `Liquid restant=${restes}` +
      (ecrits.length ? `\n  ⚠️  ${ecrits.join("\n  ⚠️  ")}` : "")
  );
}

console.log("\nDetail des maximums utilises :");
console.log("  " + Object.entries(MAX).map(([k, v]) => `${k}/${v}`).join("  "));

if (erreurs > 0) {
  console.error(`\n${erreurs} incoherence(s) dans les profils — voir les ⚠️ ci-dessus.`);
  process.exit(1);
}
console.log(`\n${profils.length} profils rendus dans ${outDir}/, tous coherents.`);
