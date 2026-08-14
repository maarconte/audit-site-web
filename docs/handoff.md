# Reprise de contexte — au 14/08/2026

À lire en premier dans une nouvelle conversation. Les décisions et le détail des
tickets sont dans [`roadmap.md`](roadmap.md) et [`roadmap-tickets.md`](roadmap-tickets.md).

---

## Le projet

Outil d'auto-analyse de site web, servant à générer des leads sur de la refonte pour
l'agence **THATMUCH**.

| | |
|---|---|
| Offre vendue | **Design sur WordPress** |
| Cible | **PME**, ancrage **Paris / Île-de-France** |
| Panier moyen | **2000-3000 €** |
| Budget infra accepté | **10 €/mois** |
| Équipe | Mathilde seule, assistée par IA |
| CTA visé | Prise de RDV **HubSpot Meetings** (`meetings-eu1.hubspot.com/mathilde-arconte`) |

**État réel après un an en ligne : moins de 10 soumissions, 0 rendez-vous.**

## Les deux dépôts

| Repo | Local | Remote | Rôle |
|---|---|---|---|
| Outil | `analyse-refonte-web` | `maarconte/audit-site-web` | Next 16, export statique, quiz 21 questions |
| Site principal | `thatmuch` | `ThatMuch/website` | Gatsby headless + WordPress (`back.thatmuch.fr`) |

Hébergement Hostinger, compte `u566000124`, SSH `72.62.214.97:65002`
(port filtré depuis le poste de Mathilde — les tests locaux SSH sont impossibles,
seuls les runners GitHub y accèdent).

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

| Sujet | Décision |
|---|---|
| Sens du score | **100 = urgence de refonte maximale** (inversion complète) |
| Pondération | `design 30 · ux 22 · seo 18 · performance 15 · technique 15` |
| RGPD | Hors score, en alertes binaires |
| Marketing | Hors score, devient multiplicateur d'urgence |
| Calibration | Panel manuel de 15 sites PME parisiens + 5 profils bornes (historique inexploitable) |
| Rang comparatif | Retiré jusqu'à 50 soumissions |
| Gate email | **Conservé** — score partiel affiché, détail par mail |
| Bootstrap | À retirer, migration Tailwind (déjà installé) |
| Requêtes SEO | Niches WordPress + Paris. **Pas** « refonte site web » en cible directe |
| Vision IA | **Reportée**, conditionnée à 30 soumissions/mois sur 2 mois (P6-1) |

---

## État réel au 14/08/2026

### ⚠️ La Phase 0 est écrite, elle n'est pas en ligne

**Les 12 points sont fusionnés dans `develop`. `main` n'a rien reçu.** Les leads qui
soumettent le quiz aujourd'hui reçoivent toujours l'ancien mail.

| Ticket | Objet | État |
|---|---|---|
| REF-1 | Mail qui dissuade réécrit, CTA remonté | dans `develop` |
| REF-2 | Dénominateurs Marketing et Légal corrigés | dans `develop` |
| REF-3 | Inversion `legal-2` + test des 21 directions | dans `develop` |
| REF-4 | Analytics + bandeau de consentement révocable | dans `develop`, **événements validés en réel** |
| REF-5 | Search Console | **relevé à compléter** — voir plus bas |
| REF-6 | CTA de RDV à deux points de sortie | dans `develop` |

### La séquence de mise en production, dans cet ordre

1. PR `develop` → `main`, portant les `Fixes REF-1` à `REF-6` — c'est elle qui fait
   passer les tickets en `Done`, puisque c'est elle qui met réellement en ligne
2. Attendre la fin du workflow `nextjs.yml`
3. **Seulement ensuite**, coller `codeEmailBrevo.html` dans Brevo

**L'ordre 2 avant 3 est impératif** : les URL d'images
`thatmuch.fr/audit-refonte/email/*.png` n'existent qu'après déploiement. Dans
l'autre sens, tous les envois partent avec sept icônes cassées.

### Ce qui reste ouvert sur la Phase 0

- **Relevé Search Console** — à faire dès le 15/08. Ouvrir la propriété
  `https://thatmuch.fr/audit-refonte/`, noter impressions, clics, position moyenne
  et premières requêtes. C'est le seul chiffre de départ qui existera jamais :
  aucun historique n'est récupérable. Ne pas fermer REF-5 avant.
- **Envoi de test Brevo** sur les trois branches de message — dernier critère
  d'acceptation de REF-1, impossible à automatiser. Un rendu local existe :
  `node scripts/render-email-preview.mjs`.
- **Politique de confidentialité** : elle doit mentionner la mesure d'audience, le
  bandeau de consentement y renvoie.
- **`marketing-3` est inversée** au même titre que `legal-2` l'était : « je souhaite
  ajouter des pages » vaut 5, alors que ça décrit un besoin, pas un site sain. Non
  corrigée à dessein — P1-4 sort marketing du score pour en faire un multiplicateur
  d'urgence, où le 5 redevient juste. Signalée en `todo` par `npm test`.

### Restes plus anciens, toujours valables

- Retirer le domaine personnalisé dans `Settings → Pages` de
  `maarconte/audit-site-web`, puis désactiver Pages (cosmétique).
- **Vérifier que `deploy.yml` a bien été poussé sur `develop`** de
  `ThatMuch/website`. Sans lui, la prochaine publication d'article reconstruit
  `develop` et efface le contenu de `main` — c'est déjà arrivé une fois.

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

[`lecons-techniques.md`](lecons-techniques.md) conserve le *pourquoi* de deux
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
