# Analyse de refonte web — THATMUCH -

Outil d'auto-évaluation en ligne qui permet à un visiteur de savoir si c'est le
bon moment pour refaire son site internet. L'utilisateur répond à un
questionnaire, obtient un score de refonte par catégorie (design, UX,
marketing, SEO, technique, performance, légal), puis laisse son email pour
recevoir le détail de son analyse — le tout comme outil de génération de leads
pour l'agence [THATMUCH](https://thatmuch.fr), spécialisée en refonte de sites
WordPress pour PME.

Contexte produit et roadmap détaillés : [`docs/roadmap.md`](docs/roadmap.md).

## Stack

- **Next.js 16** (App Router, export statique via `output: "export"`) + React 19
- **TypeScript**, **Sass** + **Tailwind CSS 4**, Bootstrap (en cours de retrait, cf. roadmap)
- **Zustand** pour le state du score, **Formik** + **Yup** pour le formulaire
- **GSAP** pour les animations
- **Firebase** : Firestore (stockage des soumissions) + Cloud Functions (`functions/`, Node 20)
- **Brevo** : CRM/emailing — la Cloud Function `submitForm` pousse le contact et son score, un template email (`codeEmailBrevo.html`) restitue l'analyse

## Structure

```
app/                      Routes Next.js (App Router)
  page.tsx                  Landing page
  refonte-form/             Formulaire d'auto-évaluation
src/
  components/LandingRefonte/  Landing, formulaire, sections de score
  components/UI/              Composants UI génériques
  data/questionquiz.json      Questions et pondération du quiz
  store/useScoreStore.ts      State Zustand du score
  utils/firebase.ts           Init client Firebase
functions/                  Cloud Function submitForm (Firestore + Brevo)
codeEmailBrevo.html         Template de l'email de restitution (Brevo)
docs/                       Roadmap produit, tickets, export Linear
scripts/linear-export.mjs   Export des tickets vers Linear
scripts/audit-tool/         Outil d'audit interne (voir ci-dessous)
```

## Démarrage

```bash
npm install
cp .env.example .env.local   # et .env.dev pour le mode dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Les variables d'environnement (voir [`.env.example`](.env.example)) couvrent
la config Firebase client et l'URL de la Cloud Function de soumission :

- `npm run dev` charge `.env.dev`
- `npm run build` / `npm run start` chargent `.env.local`
- `NEXT_PUBLIC_IS_TEST_ENV` bascule les soumissions vers la liste Brevo et la
  collection Firestore de test plutôt que celles de production

## Scripts

```bash
npm run dev         # Serveur de dev (Next.js, charge .env.dev)
npm run build       # Export statique de production (charge .env.local)
npm run start       # Build + sert le dossier out/ via `serve`
npm run lint        # ESLint
npm test            # Tests (node --test), notamment le sens des questions du quiz
npm run audit:tool  # Outil d'audit interne — voir ci-dessous
```

## Outil d'audit interne

`scripts/audit-tool/` : petit serveur local (jamais déployé, hors du build
Next.js) pour tester en profondeur l'analyse d'un site externe sans passer par
le quiz déclaratif ni générer de mail. Sert de base d'exploration avant
d'éventuellement automatiser l'analyse (cf. roadmap, phase 4).

```bash
npm run audit:tool
```

Ouvrir [http://localhost:4949](http://localhost:4949), coller une URL. Le
rapport heuristique (lecture du HTML brut, sans rendu JS ni capture d'écran)
couvre quatre catégories :

- **SEO** — titre, meta description, Open Graph, nombre de H1, hiérarchie de
  titres, contenu réellement présent dans le HTML (détecte les sites en
  JavaScript pur sans rendu serveur), URL canonique
- **Accessibilité** — texte alternatif des images, attribut `lang`, zoom
  mobile, viewport (le contraste et la navigation clavier restent à vérifier
  manuellement)
- **Performance** — poids du HTML, temps de réponse serveur, outil
  d'analytics détecté, ressources externes chargées
- **Design** — signaux observables sans rendu visuel uniquement (thème/CMS
  détecté, police personnalisée, image de partage et son orientation,
  favicon) : aucune note d'esthétique n'est calculée

La plateforme (WordPress/Wix/Webflow/Bubble/Odoo/Vite...) et l'activité d'un
bandeau cookies sont affichées en en-tête du rapport.

## Déploiement

Le site est exporté en statique (`out/`) et déployé par
[`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) sur push vers
`main` : build Next.js puis dépôt SCP dans le sous-dossier
`/audit-refonte` de `thatmuch.fr` (hébergement Hostinger), aux côtés du site
principal (headless Gatsby + WordPress).

La Cloud Function (`functions/`) se déploie séparément via Firebase CLI :

```bash
cd functions && npm run deploy
```

## Roadmap

Le projet suit une roadmap active organisée en phases (P0 à P6) : réparer et
mesurer, revoir le scoring, travailler l'acquisition, la restitution, puis
l'analyse automatique. Détails et suivi :

- [`docs/roadmap.md`](docs/roadmap.md) — diagnostic, décisions actées, séquencement
- [`docs/roadmap-tickets.md`](docs/roadmap-tickets.md) — détail des tickets
- [`docs/linear/`](docs/linear/) — export et import vers Linear
