#!/usr/bin/env node
/**
 * Rend codeEmailBrevo.html hors de Brevo, pour visualiser le mail sans envoi.
 *
 * Ne gere que le sous-ensemble Liquid reellement utilise par le template :
 *   {{ contact.X }}                         substitution
 *   {% if contact.X >= n %} ... {% endif %} condition simple
 *   {% if a and b %}                        conjonction de deux comparaisons
 *
 * Deux sources possibles, auto-detectees sur la forme du fichier :
 *   - tests/fixtures/profils-email.json (cle "profils" + "maximums")   -> /100
 *   - prospects.json (cle "prospects" + "maximums_externe")            -> /85
 * Le template affiche un TOTAL en dur sur "/100" (voir codeEmailBrevo.html) et
 * ses seuils de branche (>=66 haute, >33 mediane, <=33 basse) sont calibres
 * sur cette echelle. Pour un denominateur reduit (categorie MARKETING absente
 * des analyses externes — le formulaire du quiz ne permet pas de repondre
 * qu'a marketing-4, cf. prospects.json), le score brut est donc rescale en
 * pourcentage avant d'etre injecte dans le template — sinon le TOTAL affiche
 * mentirait ("45/100" alors que 45 a ete obtenu sur 85) et les branches
 * tomberaient au mauvais seuil.
 *
 * Usage : node scripts/render-email-preview.mjs [dossier-de-sortie] [fichier]
 * Sortie par defaut : .email-preview/ (ignore par git)
 * Fichier par defaut : tests/fixtures/profils-email.json
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const template = readFileSync("codeEmailBrevo.html", "utf8");
const outDir = process.argv[2] ?? ".email-preview";
const fichierSource = process.argv[3] ?? "tests/fixtures/profils-email.json";
mkdirSync(outDir, { recursive: true });

const fixture = JSON.parse(readFileSync(fichierSource, "utf8"));

const items = fixture.profils ?? fixture.prospects;
if (!items) {
  throw new Error(`${fichierSource} n'a ni "profils" ni "prospects"`);
}
const MAX = fixture.maximums_externe ?? fixture.maximums;
if (!MAX) {
  throw new Error(`${fichierSource} n'a ni "maximums_externe" ni "maximums"`);
}
const maxEffectif = Object.values(MAX).reduce((s, v) => s + v, 0);

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
  const brut = Object.keys(MAX).reduce((s, k) => s + Number(attrs[k] ?? 0), 0);
  // Rescale sur 100 : no-op quand maxEffectif vaut deja 100 (fixture declarative).
  const total = Math.round((brut / maxEffectif) * 100);
  const complet = { ...attrs, TOTAL: total };
  let html = resoudreConditions(template, complet);
  html = html.replace(/\{\{\s*contact\.([A-Z_]+)\s*\}\}/g, (_, k) =>
    String(complet[k] ?? "")
  );
  return { html, brut, total };
}

/** Branche de message attendue pour un TOTAL /100, d'apres les seuils du template. */
const brancheAttendue = (total) =>
  total >= 66 ? "haute" : total > 33 ? "mediane" : "basse";

const index = [];
let erreurs = 0;
for (const item of items) {
  const { html, brut, total } = rendre(item.contact.attributes);
  const fichier = `${item.nom}.html`;
  writeFileSync(join(outDir, fichier), html, "utf8");

  const restes = (html.match(/\{%|\{\{/g) || []).length;
  const boutons = (html.match(/meetings-eu1/g) || []).length;

  const ecrits = [];
  // Verifications de coherence de fixture (profils-email.json uniquement :
  // totalAttendu/branche n'existent pas pour un prospect reel en cours d'analyse).
  if (item.totalAttendu !== undefined && brut !== item.totalAttendu) {
    ecrits.push(`somme=${brut} mais totalAttendu=${item.totalAttendu}`);
  }
  if (item.branche !== undefined && brancheAttendue(total) !== item.branche) {
    ecrits.push(`branche=${item.branche} mais ${total}/100 tombe en ${brancheAttendue(total)}`);
  }
  if (restes > 0) ecrits.push(`${restes} balise(s) Liquid non resolue(s)`);
  if (boutons === 0) ecrits.push("aucun bouton de RDV dans le rendu");

  erreurs += ecrits.length;
  index.push({ fichier, titre: item.titre ?? item.entreprise, brut, total, restes, boutons });
  const brutLabel = maxEffectif !== 100 ? `brut=${String(brut).padStart(3)}/${maxEffectif} → ` : "";
  console.log(
    `${fichier.padEnd(24)} ${brutLabel}TOTAL=${String(total).padStart(3)}/100  ` +
      `branche=${brancheAttendue(total).padEnd(8)} boutons RDV=${boutons}  ` +
      `Liquid restant=${restes}` +
      (ecrits.length ? `\n  ⚠️  ${ecrits.join("\n  ⚠️  ")}` : "")
  );
}

console.log(`\nSource : ${fichierSource}`);
console.log(
  "Detail des maximums utilises (denominateur=" + maxEffectif + ") :\n  " +
    Object.entries(MAX).map(([k, v]) => `${k}/${v}`).join("  ")
);

if (erreurs > 0) {
  console.error(`\n${erreurs} incoherence(s) — voir les ⚠️ ci-dessus.`);
  process.exit(1);
}
console.log(`\n${items.length} rendus dans ${outDir}/, tous coherents.`);
