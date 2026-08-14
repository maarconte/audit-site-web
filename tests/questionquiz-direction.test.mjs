/**
 * Verifie le SENS de chaque question du quiz.
 *
 * Direction actuelle du score : un score eleve decrit un site en bonne sante.
 * L'inversion vers « 100 = urgence de refonte maximale » est le sujet de P1-1 ;
 * ce fichier devra alors etre inverse en meme temps que les donnees, et c'est
 * precisement ce qu'on veut : le test doit casser si les donnees changent de
 * sens sans que l'intention soit mise a jour.
 *
 * Chaque entree declare un fragment de la reponse qui doit obtenir le score le
 * plus eleve. On matche sur un fragment plutot que sur le libelle exact pour ne
 * pas dependre de la typographie (apostrophes droites ou courbes, accents).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const categories = JSON.parse(
  readFileSync(join(racine, "src/data/questionquiz.json"), "utf8")
);

/** id de question -> fragment attendu de la meilleure reponse. */
const MEILLEURE_REPONSE = {
  "design-1": "moins d",
  "design-2": "ux/ui designer",
  "design-3": "typographies",
  "ux-1": "oui",
  "ux-2": "oui",
  "ux-3": "oui",
  "marketing-1": "pas chang",
  "marketing-2": "pas chang",
  "marketing-3": "non",
  "marketing-4": "oui",
  "seo-1": "oui",
  "seo-2": "oui",
  "performance-1": "oui",
  "performance-2": "moins de 3 secondes",
  "performance-3": "beaucoup",
  "technique-1": "wordpress",
  "technique-2": "sans difficult",
  "technique-3": "pas du tout",
  "legal-1": "oui",
  "legal-2": "oui",
  "legal-3": "oui",
};

/**
 * Questions dont le sens est connu comme incorrect mais pas encore tranche.
 * Declarees en todo : le test s'execute et signale, sans faire echouer la suite.
 */
const EN_ATTENTE_DE_DECISION = {
  "marketing-3":
    "Vouloir ajouter des pages decrit un besoin, pas un site sain : " +
    "« Oui » vaut 5 aujourd'hui. Arbitrage lie a P1-4, qui sort marketing " +
    "du score pour en faire un multiplicateur d'urgence.",
};

const toutesLesQuestions = categories.flatMap((c) => c.questions);

test("chaque question du fichier declare une direction attendue", () => {
  const ids = toutesLesQuestions.map((q) => q.id);
  const nonCouvertes = ids.filter((id) => !(id in MEILLEURE_REPONSE));
  assert.deepEqual(
    nonCouvertes,
    [],
    "Question ajoutee sans direction attendue : completer MEILLEURE_REPONSE"
  );
  assert.equal(ids.length, 21, "le quiz doit compter 21 questions");
});

for (const question of toutesLesQuestions) {
  const fragment = MEILLEURE_REPONSE[question.id];
  if (!fragment) continue;

  const options = { todo: EN_ATTENTE_DE_DECISION[question.id] };

  test(`${question.id} — la meilleure reponse est celle attendue`, options, () => {
    const scoreMax = Math.max(...question.options.map((o) => o.score));
    const gagnantes = question.options
      .filter((o) => o.score === scoreMax)
      .map((o) => o.text.toLowerCase());

    assert.ok(
      gagnantes.some((texte) => texte.includes(fragment)),
      `${question.id} : le score le plus eleve (${scoreMax}) va a ` +
        `${JSON.stringify(gagnantes)}, or on attend une reponse contenant ` +
        `"${fragment}". Sens de la question probablement inverse.`
    );
  });
}

test("aucune option ne porte un score hors bornes", () => {
  for (const question of toutesLesQuestions) {
    for (const option of question.options) {
      assert.ok(
        Number.isInteger(option.score) && option.score >= 0 && option.score <= 5,
        `${question.id} : score ${option.score} hors de l'echelle 0-5`
      );
    }
  }
});

test("les maximums par categorie sont ceux affiches dans le mail", () => {
  const attendus = {
    design: 15,
    ux: 15,
    marketing: 15,
    seo: 10,
    performance: 15,
    technique: 15,
    legal: 15,
  };

  let total = 0;
  for (const categorie of categories) {
    const max = categorie.questions.reduce(
      (somme, q) => somme + Math.max(...q.options.map((o) => o.score)),
      0
    );
    total += max;
    assert.equal(
      max,
      attendus[categorie.slug],
      `${categorie.slug} : maximum ${max}, or codeEmailBrevo.html affiche ` +
        `/${attendus[categorie.slug]}. Mettre le mail a jour, ou corriger les donnees.`
    );
  }

  assert.equal(total, 100, "le TOTAL affiche /100 dans le mail");
});
