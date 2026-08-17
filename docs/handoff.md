# Reprise de contexte — au 14/08/2026

À lire en premier dans une nouvelle conversation. Les décisions et le détail des
tickets sont dans [`roadmap.md`](roadmap.md) et [`roadmap-tickets.md`](roadmap-tickets.md).

---

---

## Le projet

Outil d'auto-analyse de site web, servant à générer des leads sur de la **refonte** pour
l'agence **THATMUCH**.

|                      |                                                                                 |
| -------------------- | ------------------------------------------------------------------------------- |
| Offre vendue         | **Design sur WordPress**                                                        |
| Cible                | **PME**, ancrage **Paris / Île-de-France**                                      |
| Panier moyen         | **2000-3000 €**                                                                 |
| Budget infra accepté | **10 €/mois**                                                                   |
| Équipe               | Mathilde seule, assistée par IA                                                 |
| CTA visé             | Prise de RDV **HubSpot Meetings** (`meetings-eu1.hubspot.com/mathilde-arconte`) |

**État réel après un an en ligne : moins de 10 soumissions, 0 rendez-vous.**

## Les deux dépôts

| Repo           | Local                 | Remote                     | Rôle                                             |
| -------------- | --------------------- | -------------------------- | ------------------------------------------------ |
| Outil          | `analyse-refonte-web` | `maarconte/audit-site-web` | Next 16, export statique, quiz 21 questions      |
| Site principal | `thatmuch`            | `ThatMuch/website`         | Gatsby headless + WordPress (`back.thatmuch.fr`) |

Hébergement Hostinger, compte `u566000124`, plan `cloud_economy_v3`,
SSH `72.62.214.97:65002`.

> **Correction du 17/08/2026.** Le handoff affirmait que ce port était filtré depuis
> le poste de Mathilde et que seuls les runners GitHub y accédaient. **C'est faux** :
> `nc 72.62.214.97 65002` répond `SSH-2.0-OpenSSH_9.9` en local. Le diagnostic depuis
> le poste est donc possible, et c'est lui qui a permis d'innocenter le serveur lors
> de l'échec de déploiement du 17/08 — voir
> [`lecons-techniques.md`](lecons-techniques.md#le-scp-de-déploiement-échoue-par-intermittence).

**Deux pipelines écrivent dans `/home/u566000124/domains/thatmuch.fr/public_html` :**

1. **Web App Hostinger** — déploie `main` de `ThatMuch/website` sur push. C'est la prod.
2. **GitHub Actions `Deploy React to Hostinger`** — déclenché par WordPress
   (`repository_dispatch: cms_update`). Corrigé pour builder `main` via `ref: main`.
3. **GitHub Actions `nextjs.yml`** (repo outil) — SCP vers le sous-dossier `audit-refonte`.

Aucun n'efface : tous écrasent et ajoutent.

---

## Diagnostic — pourquoi 0 RDV

Quatre causes identifiées dans le code. **Les quatre sont corrigées dans `develop`
depuis le 14/08/2026, mais rien n'est déployé** — voir « État réel » plus bas.

1. **Le mail dissuade.** `codeEmailBrevo.html` : `{% if contact.TOTAL >= 66 %}` →
   « Félicitations ! Votre site tient encore la route, une refonte n'est pas urgente. »
   Suivi d'un bouton « Prendre RDV ».
2. **Deux dénominateurs faux dans le mail.** Marketing affiché `/10` pour un max de
   **15** ; Légal `/20` pour **15**. Le `TOTAL /100` est juste (max réel 100), contre
   ce qu'annonçait la première analyse.
3. **Aucun analytics installé.** `src/utils/firebase.ts` n'initialise que Firestore,
   `getAnalytics` n'est appelé nulle part. Zéro donnée depuis un an.
4. **Aucun chemin vers la prise de RDV dans le produit.** Le tunnel finit sur « regardez vos
   mails ». Le seul bouton est dans le mail, sous le message qui dissuade.

Autres défauts du scoring : `legal-2` inversé (Oui = 0), pondération accidentelle
(somme brute, marketing pèse 16,7 % et SEO 9,8 % par accident), « Je ne sais pas »
crédité 3/5.

---

## Décisions actées

| Sujet           | Décision                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| Sens du score   | **100 = urgence de refonte maximale** (inversion complète)                           |
| Pondération     | `design 30 · ux 22 · seo 18 · performance 15 · technique 15`                         |
| RGPD            | Hors score, en alertes binaires                                                      |
| Marketing       | Hors score, devient multiplicateur d'urgence                                         |
| Calibration     | Panel manuel de 15 sites PME parisiens + 5 profils bornes (historique inexploitable) |
| Rang comparatif | Retiré jusqu'à 50 soumissions                                                        |
| Gate email      | **Conservé** — score partiel affiché, détail par mail                                |
| Bootstrap       | À retirer, migration Tailwind (déjà installé)                                        |
| Requêtes SEO    | Niches WordPress + Paris. **Pas** « refonte site web » en cible directe              |
| Vision IA       | **Reportée**, conditionnée à 30 soumissions/mois sur 2 mois (P6-1)                   |

---

## État réel au 17/08/2026

### ✅ La Phase 0 est en ligne

**Déployée le 17/08/2026** par la PR [#115](https://github.com/maarconte/audit-site-web/pull/115)
(`develop` → `main`, 24 commits, 45 fichiers). Ses `Fixes REF-1` à `REF-6` ont fait
passer les six tickets en `Done`.

| Ticket | Objet                                         | État                                    |
| ------ | --------------------------------------------- | --------------------------------------- |
| REF-1  | Mail qui dissuade réécrit, CTA remonté        | `Done` — **reste l'envoi de test Brevo** |
| REF-2  | Dénominateurs Marketing et Légal corrigés     | `Done` — vérifié sur un envoi réel      |
| REF-3  | Inversion `legal-2` + test des 21 directions  | `Done`                                  |
| REF-4  | Analytics + bandeau de consentement révocable | `Done` — événements validés en réel     |
| REF-5  | Search Console                                | `Done` — ligne de base relevée le 17/08 |
| REF-6  | CTA de RDV à deux points de sortie            | `Done`                                  |

Vérifié en ligne après déploiement : les sept icônes du mail répondent **200
`image/png`**, `/audit-refonte/` et `/audit-refonte/refonte-form/` répondent 200, et
la home de `thatmuch.fr` est intacte — le SCP n'a pas débordé de son sous-dossier.

### Le template est en place dans Brevo

**Collé et testé le 17/08/2026, les sept icônes s'affichent.** Le tunnel complet est
donc à jour de bout en bout : produit déployé, images servies, mail à jour.

Reste à couvrir **deux des trois branches de message** — dernier critère
d'acceptation de REF-1 — **couvert le 17/08/2026** :

| Branche | Condition        | Message                                      | Testée |
| ------- | ---------------- | -------------------------------------------- | ------ |
| Haute   | `TOTAL >= 66`    | « Votre site tient la route. »               | oui    |
| Moyenne | `33 < TOTAL < 66`| « Votre site montre des signes de fatigue. » | oui    |
| Basse   | `TOTAL <= 33`    | « Votre site vous coûte des clients. »       | oui    |

Bornes vérifiées, sans trou : `33` tombe dans la basse, `34` dans la moyenne, `66`
dans la haute. La phrase « une refonte n'est pas urgente » est absente des rendus
des branches hautes (78 et 66) — c'est le défaut que REF-1 corrigeait.

Les jeux d'attributs sont figés dans [`tests/fixtures/profils-email.json`](../tests/fixtures/profils-email.json) :
huit profils couvrant les trois branches, les quatre bornes de basculement et le
cas réel à 41. Le bloc `contact` de chaque profil est collable dans un contact de
test Brevo. `node scripts/render-email-preview.mjs` les rend hors de Brevo et
**sort en code 1** si un profil devient incohérent.

> **Règle pour les prochaines modifications du mail.** Déployer d'abord, coller
> ensuite. Toute nouvelle image référencée en `thatmuch.fr/audit-refonte/email/…`
> n'existe qu'après passage de `nextjs.yml` sur `main`.

### 🎯 Phase 0 close le 17/08/2026

Les six tickets sont `Done`, déployés et vérifiés en ligne. Les trois angles morts
du diagnostic initial sont fermés : le mail ne dissuade plus, le tunnel mène à une
prise de RDV mesurée, et il existe une ligne de base côté produit comme côté
recherche. **Rien n'est prouvé pour autant** — la Phase 0 rend l'outil observable,
elle ne le rend pas performant. Les chiffres arrivent maintenant.

Vérifications faites à la clôture :

| Point                                   | Résultat                                             |
| --------------------------------------- | ---------------------------------------------------- |
| `deploy.yml` sur `develop` de `ThatMuch/website` | **présent**, avec `ref: inputs.branch \|\| 'main'` — le risque d'écrasement de `main` par une publication WordPress est fermé |
| Domaine personnalisé GitHub Pages       | **déjà retiré** (`cname: null`). Pages reste activé, purement cosmétique |
| Politique de confidentialité            | mentionne Google Analytics, le suivi d'audience, les cookies, le consentement et son retrait — **le point du handoff est satisfait**, à une réserve près ci-dessous |

### Ce qui reste, hors Phase 0

- **La politique de confidentialité décrit le mauvais mécanisme de consentement.**
  Elle annonce une gestion « via Axeptio » et un « bandeau dédié » — c'est vrai du
  site Gatsby, mais **pas de `/audit-refonte`**, qui a son propre
  `ConsentBanner.tsx`. La finalité et l'outil sont bien couverts (Firebase
  Analytics est du GA4, la ligne « Google Analytics » du tableau est exacte) ;
  c'est le moyen de retrait qui est faux pour l'outil. Un paragraphe à ajouter,
  pas une refonte du document. À ticketer.
- **`marketing-3` est inversée** au même titre que `legal-2` l'était : « je souhaite
  ajouter des pages » vaut 5, alors que ça décrit un besoin, pas un site sain. Non
  corrigée à dessein — P1-4 sort marketing du score pour en faire un multiplicateur
  d'urgence, où le 5 redevient juste. Signalée en `todo` par `npm test`.

### Sur le mail — corrections hors ticket

Au-delà de REF-1 et REF-2, l'audit du template a produit : URL Google Fonts
corrigée (une espace non encodée empêchait tout chargement), `alt` et `height`
ajoutés aux trois images qui en manquaient, et **rapatriement des icônes** depuis
`i.postimg.cc` vers `public/email/` — versionnées, redimensionnées au double de leur
taille d'affichage, **110 Ko ramenés à 16 Ko**.

Reste `blog-placeholder-design-01.png`, un placeholder WordPress de 2021 servant de
vignette d'article : choix éditorial, non tranché.

---

**Une inconnue qui réordonne la suite :**

- ~~Search Console (P0-5)~~ **levée le 14/08/2026** : les deux pages sont indexées,
  aucun historique n'existe, la ligne de base démarre maintenant. La Phase 2 reste
  devant la Phase 3, mais P2-2, P2-3 et P2-5 passent devant P2-4 — le goulot est le
  positionnement, pas l'exploration. Détail dans [`roadmap.md`](roadmap.md).
- P2-9 (20 analyses envoyées en prospection) conditionne P4-7 puis P6-1.

---

## Leçons techniques

[`lecons-techniques.md`](lecons-techniques.md) conserve le _pourquoi_ de deux
décisions encore visibles dans le code : le durcissement de la Cloud Function contre
le mass assignment (le SDK admin contourne `firestore.rules`) et l'arrêt explicite de
la boucle d'animation de `ClickSpark`. Récupéré du dossier `.jules/`, supprimé avec
l'arrêt des agents automatiques.

---

## Gestion de projet

**Linear est en place** — workspace `linear.app/thatmuch`, équipe **« Audit Refonte »,
clé `REF`**, distincte de l'équipe `THATMUCH` pour ne pas mêler les réglages.

- Initiative « Génération de leads refonte », 7 projets (un par phase)
- 22 labels d'équipe, plus le label workspace `Bug` réutilisé — `bug` en minuscules
  n'a pas pu être créé, Linear refusant les doublons insensibles à la casse
- Estimations en Fibonacci, format de branche réduit à l'identifiant (`ref-12`)

**⚠️ Seuls 18 tickets sur 42 sont créés** (`REF-1` à `REF-18`) : le **plafond de
250 issues du plan gratuit** est atteint à l'échelle du workspace, `THATMUCH`
l'occupant presque entièrement. La création s'est arrêtée net sur P2-5.

L'archivage manuel n'existe pas dans Linear — seul l'auto-archivage existe, il tourne
sous 24 h et **n'archive pas une issue close tant que son projet n'est pas clos**.
Les 24 tickets restants (P2-5 à P6-1) sont dans `tickets.json`, à créer au fil de
l'eau ou après passage en plan payant.

- Source de vérité : [`linear/tickets.json`](linear/tickets.json)
- Régénération des exports : `node scripts/linear-export.mjs`
- Procédure et câblage GitHub : [`linear/README.md`](linear/README.md)

**Convention de PR** : le dépôt a un [template](../.github/pull_request_template.md)
avec une section « Impact sur le score » obligatoire dès que la PR touche
`src/lib/scoring/`, `src/data/questionquiz.json` ou `functions/src/`. Les PR portent
`Part of REF-XX` et non `Fixes` : la fusion dans `develop` ne déploie rien, c'est la
PR `develop` → `main` qui doit fermer les tickets.

---

## Outillage ajouté

- `npm test` — 24 tests sur le runner Node natif, sans dépendance. Vérifie la
  direction des 21 questions, que toute question ajoutée déclare la sienne, et que
  **les maximums par catégorie correspondent aux dénominateurs du mail**.
- `node scripts/render-email-preview.mjs` — rend `codeEmailBrevo.html` hors de Brevo,
  un fichier HTML par branche de score, dans `.email-preview/` (ignoré par git).
- `node scripts/linear-export.mjs` — régénère le CSV et `roadmap-tickets.md` depuis
  `tickets.json`.

**Ménage du dépôt** : les 107 PR ouvertes par les agents automatiques ont été fermées
le 14/08/2026 (correctifs déjà appliqués, ou portant sur du code que P2-7 réécrira),
leurs branches supprimées, et `.jules/` retiré. Il ne reste que `main` et `develop`.
