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

/** Maximums reels par attribut, calcules depuis src/data/questionquiz.json. */
const MAX = {
  DESIGN: 15,
  UX: 15,
  MARKETING: 15,
  SEO: 10,
  PERFORMANCE: 15,
  TECH: 15,
  LEGAL: 15,
};

/** Trois profils couvrant les trois branches de message du mail. */
const profils = [
  {
    nom: "01-score-haut",
    titre: "Score 78/100 — branche « site sain » (TOTAL >= 66)",
    attrs: {
      PRENOM: "Claire",
      NOM: "Fontaine",
      URL: "https://cabinet-fontaine.fr",
      DESIGN: 12,
      UX: 13,
      MARKETING: 9,
      SEO: 7,
      PERFORMANCE: 12,
      TECH: 14,
      LEGAL: 11,
    },
  },
  {
    nom: "02-score-median",
    titre: "Score 52/100 — branche « signes de fatigue » (34-65)",
    attrs: {
      PRENOM: "Marc",
      NOM: "Delaunay",
      URL: "https://delaunay-menuiserie.fr",
      DESIGN: 7,
      UX: 8,
      MARKETING: 6,
      SEO: 4,
      PERFORMANCE: 9,
      TECH: 10,
      LEGAL: 8,
    },
  },
  {
    nom: "03-score-bas",
    titre: "Score 22/100 — branche « coûte des clients » (<= 33)",
    attrs: {
      PRENOM: "Sophie",
      NOM: "Berger",
      URL: "https://berger-conseil.fr",
      DESIGN: 3,
      UX: 2,
      MARKETING: 5,
      SEO: 1,
      PERFORMANCE: 4,
      TECH: 5,
      LEGAL: 2,
    },
  },
];

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

const index = [];
for (const profil of profils) {
  const { html, total } = rendre(profil.attrs);
  const fichier = `${profil.nom}.html`;
  writeFileSync(join(outDir, fichier), html, "utf8");

  const restes = (html.match(/\{%|\{\{/g) || []).length;
  const boutons = (html.match(/meetings-eu1/g) || []).length;
  index.push({ fichier, titre: profil.titre, total, restes, boutons });
  console.log(
    `${fichier.padEnd(20)} TOTAL=${String(total).padStart(3)}  ` +
      `boutons RDV=${boutons}  balises Liquid restantes=${restes}`
  );
}

console.log("\nDetail des maximums utilises :");
console.log("  " + Object.entries(MAX).map(([k, v]) => `${k}/${v}`).join("  "));
