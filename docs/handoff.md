# Reprise de contexte — au 17/08/2026 (soir)

À lire en premier dans une nouvelle conversation. Les décisions et le détail des
tickets sont dans [`roadmap.md`](roadmap.md) et [`roadmap-tickets.md`](roadmap-tickets.md).

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

**État réel après un an en ligne : moins de 10 soumissions, 0 rendez-vous.** La
Phase 0 (ci-dessous) a réparé le tunnel ; rien ne prouve encore qu'il convertit
mieux — c'est ce que les prochaines semaines de données diront.

## Les deux dépôts

| Repo           | Local                 | Remote                     | Rôle                                             |
| -------------- | --------------------- | --------------------------- | ------------------------------------------------ |
| Outil          | `analyse-refonte-web` | `maarconte/audit-site-web` | Next 16, export statique, quiz 21 questions      |
| Site principal | `thatmuch`            | `ThatMuch/website`         | Gatsby headless + WordPress (`back.thatmuch.fr`) |

Hébergement Hostinger, compte `u566000124`, plan `cloud_economy_v3`,
SSH `72.62.214.97:65002` — **joignable depuis le poste** (`nc` répond), malgré ce
qu'affirmait une version antérieure de ce document.

**Deux pipelines écrivent dans `/home/u566000124/domains/thatmuch.fr/public_html` :**

1. **Web App Hostinger** — déploie `main` de `ThatMuch/website` sur push. C'est la prod.
2. **GitHub Actions `Deploy React to Hostinger`** — déclenché par WordPress
   (`repository_dispatch: cms_update`), builde `main` (`ref: inputs.branch || 'main'`).
3. **GitHub Actions `nextjs.yml`** (repo outil) — SCP vers le sous-dossier `audit-refonte`,
   déclenché uniquement par un push sur `main` de ce repo.

Aucun n'efface : tous écrasent et ajoutent.

---

## Convention de travail sur ce repo (lire avant d'agir)

- **Une branche `ref-XX` par ticket**, créée depuis `develop`. Les PR portent
  `Part of REF-XX` (jamais `Fixes`) vers **`develop`** : la fusion dans `develop` ne
  déploie rien, seule la PR `develop` → `main` met en ligne et ferme les tickets.
- **Cadence de mise en prod** : les PR de tickets partent vers `develop` au fil de
  l'eau. La PR `develop` → `main` se fait **en fin de phase**, pas après chaque
  ticket. Ne pas la proposer avant que la phase en cours soit terminée, sauf
  demande explicite.
- **Ne pas retourner sur `develop` après avoir poussé une branche de ticket.**
  Mathilde édite souvent les fichiers à la main juste après un push, avant de
  considérer le ticket terminé — changer de branche remplace ces retouches sous
  ses pieds. Rester sur `ref-XX` tant qu'elle n'a pas dit de passer à la suite.
- **Des fichiers changent parfois seuls pendant le travail** (retouches manuelles
  de Mathilde en parallèle). Ne jamais les revertir ; les laisser non commités si
  hors du périmètre du ticket en cours plutôt que de les committer sans lui
  demander — elle a dit explicitement « ignore pour l'instant » pour ce cas.
- Le lien automatique GitHub ↔ Linear fait passer le ticket en `In Progress` et y
  attache la PR **la plupart du temps**, pas toujours (REF-22 ne l'a pas fait) —
  vérifier après coup plutôt que supposer.
- Section « Impact sur le score » du [template de PR](../.github/pull_request_template.md)
  obligatoire dès qu'une PR touche `src/lib/scoring/`, `src/data/questionquiz.json`
  ou `functions/src/`.

---

## État au 17/08/2026 — Phase 0 : terminée et en ligne

Déployée par la PR [#115](https://github.com/maarconte/audit-site-web/pull/115)
(`develop` → `main`). Les six tickets REF-1 à REF-6 sont `Done`, vérifiés en ligne :
mail qui ne dissuade plus (trois branches testées dans Brevo, jeux de test dans
[`tests/fixtures/profils-email.json`](../tests/fixtures/profils-email.json)),
dénominateurs corrects, `legal-2` corrigé, analytics + consentement révocable en
ligne, ligne de base Search Console posée, CTA de RDV à deux points de sortie mesurés
séparément.

**REF-19** (politique de confidentialité désynchronisée du bandeau de consentement
de l'outil) trouvé et corrigé après coup, `Done` — texte dans
[`rgpd-paragraphe-confidentialite.md`](rgpd-paragraphe-confidentialite.md).

Détail complet, chiffres et réserves : voir l'historique de ce fichier ou
`roadmap.md`. Rien ne reste ouvert sur la Phase 0 hormis `marketing-3` inversée
à dessein (voir `npm test`, un `todo` sur 24 — corrigé par P1-4, pas encore fait).

---

## État au 17/08/2026 (soir) — Phase 2 : en cours, rien mergé sur `main`

**Tout ce qui suit vit dans `develop` ou sur des branches de ticket, rien n'est en
ligne.** La séquence `develop` → `main` de fin de phase reste à faire.

| Ticket | Objet | État |
| ------ | ----- | ---- |
| REF-15 (P2-1) | Sous-dossier `thatmuch.fr/audit-refonte/` | `Done`, déjà en ligne (Phase 0) |
| REF-16 (P2-2) | Requêtes ciblées, title/H1/sous-titre | Mergé dans `develop` (PR #116) |
| REF-17 (P2-3) | `metadataBase`, Open Graph, canonical | Mergé dans `develop` (PR #117) |
| REF-18 (P2-4) | `sitemap.xml`/`robots.txt` | Mergé dans `develop` (PR #118) |
| REF-20 (P2-5) | Contenu indexable sous le pli (FAQ) | Mergé dans `develop` (PR #119) |
| REF-25 (P2-10) | `NumbersSection` sourcée et redessinée | Mergé dans `develop` (PR #120) |
| **REF-22 (P2-7)** | **Retrait de Bootstrap, migration Tailwind** | **PR [#121](https://github.com/maarconte/audit-site-web/pull/121) ouverte, pas mergée** |
| REF-21 (P2-6) | LocalBusiness, WebApplication, FAQPage (JSON-LD) | Backlog, pas commencé |
| REF-23 (P2-8) | Deux cas clients chiffrés | Backlog — **nécessite des données réelles de Mathilde**, pas un ticket de code |
| REF-24 (P2-9) | 20 analyses manuelles en prospection | Backlog — **action manuelle de Mathilde**, pas un ticket de code |

### Ce que chaque ticket mergé a changé, en bref

- **P2-2** : title = « Refonte site WordPress Paris : audit gratuit en 3 min »,
  sous-titre du hero porte gratuité/PME parisiennes/3 min. H1 inchangé. Cinq
  requêtes cibles documentées dans `roadmap.md`.
- **P2-3** : `metadataBase` + canonical + OG/Twitter sur les deux pages, image OG
  générée par code puis remplacée par une image dédiée de Mathilde (1200×630).
  **Piège rencontré et documenté** : `metadataBase` n'inclut jamais le `basePath`
  automatiquement, et une image OG statique le résout différemment d'un chemin
  relatif classique — les deux mécanismes ne sont pas cohérents entre eux. Solution
  centralisée dans `src/lib/site.ts` (`BASE_PATH`/`SITE_ORIGIN`). Détail :
  [`lecons-techniques.md`](lecons-techniques.md).
- **P2-4** : `app/sitemap.ts` + `app/robots.ts`. Le `robots.txt` de ce repo est
  servi sous `/audit-refonte/robots.txt` — **aucun robot ne le lit jamais là**, le
  protocole ne regarde que la racine du domaine. Le vrai levier était le
  `robots.txt` racine de `thatmuch.fr`, qui ne déclarait pas le sitemap de l'outil
  malgré P2-1 (`Done`) qui le prévoyait déjà : corrigé dans
  [ThatMuch/website#84](https://github.com/ThatMuch/website/pull/84), **mergé**.
- **P2-5** : `SeoContentSection`, 886 mots réels sous le pli, en accordéon
  `<details>/<summary>` natif (pas de JS) — inspiré de `FAQHome`
  (`ThatMuch/website`) mais délibérément différent : la version source retire le
  texte du DOM quand la question est fermée, ce qui aurait vidé le HTML statique du
  contenu que ce ticket ajoute. Quatre des cinq questions renvoient vers un article
  réel de `thatmuch.fr`, vérifié par son contenu.
- **P2-10** : le compteur factice que le ticket visait (« X sites analysés »)
  **n'existait déjà plus** dans le code — vérifié, pas supposé. Les cinq
  statistiques génériques ont été sourcées (deux étaient mal attribuées, corrigées
  avec l'accord de Mathilde) et le design refondu pour la lisibilité (contraste,
  accents de couleur par carte, grille responsive).

### REF-22 (P2-7) — le plus gros morceau, en révision

PR [#121](https://github.com/maarconte/audit-site-web/pull/121), deux commits.
Bootstrap et GSAP (confirmé inutilisé nulle part) retirés de `package.json`,
Tailwind v4 réellement activé (il était installé mais jamais importé). Points à
connaître avant de retoucher ce périmètre :

- **Tailwind v4 ne passe pas par Sass.** `src/scss/tailwind.css` est du CSS pur,
  importé à part de `style.scss`.
- **Thème Tailwind reconfiguré** (`@theme` dans `tailwind.css`) pour reprendre la
  vraie palette du projet — le `neutral` de Tailwind est un gris générique, celui
  de ce projet est violet foncé (`$neutral-900: #1e1244`). Toujours utiliser les
  classes `text-neutral-*`/`bg-dev-*`/etc. définies là, jamais une couleur Tailwind
  par défaut sans vérifier qu'elle n'a pas été redéfinie.
- **Les utilitaires d'espacement Bootstrap et Tailwind partagent des noms pour des
  valeurs différentes** (`mb-4` = 1.5rem chez Bootstrap, 1rem chez Tailwind).
  Chaque conversion a été faite valeur par valeur, jamais par renommage à
  l'identique.
- **`priority` sur les images retirée puis restaurée** : une hypothèse non vérifiée
  (le H1 est le LCP) s'est révélée fausse à l'audit Lighthouse réel — c'est
  `planet-pink` l'élément LCP de la page d'accueil. Retirer `priority` l'avait fait
  passer en chargement paresseux, dégradant le LCP mesuré de ~2s à 7,6s.
- **Un vrai bug trouvé en mesurant** : `.planet-pink`/`.planet-yellow` portaient à
  la fois le `<img src>` de `next/image` et un `background-image` CSS pointant
  vers le même fichier — la même image chargeait deux fois. Ce doublon retiré a
  divisé par ~2 le poids total mesuré de la page.
- **Trois images retaillées** à leur taille d'affichage réelle : `planet-pink.webp`
  972 Ko → 234 Ko, `planet-yellow.webp` 398 Ko → 61 Ko, `tardisStars.webp`
  (LinkSection) 4,86 Mo → 960 Ko.

**Critère d'acceptation non vérifiable depuis cet environnement** : « score
performance mobile > 90 ». Mesuré en local contre `npx serve` (HTTP/1.1, sans
multiplexage, confirmé) : accueil 71 → **78**, `/refonte-form` **99**. L'hébergement
Hostinger réel fait probablement mieux, mais ça n'a pas pu être vérifié sans
déployer. **À remesurer une fois cette PR en ligne**, avec un vrai Lighthouse
contre `https://thatmuch.fr/audit-refonte/`.

---

## Search Console — ligne de base posée le 17/08/2026

Propriété `https://thatmuch.fr/audit-refonte/`, fenêtre 3 mois (tout l'historique
disponible, la propriété datait du 13/08) : **0 clic, 1 impression, position
moyenne 8, aucune requête exposée.** C'est le seul chiffre de départ qui existera
jamais. Détail et méthode de comparaison future dans `roadmap.md`.

Ne pas revenir mesurer avant que P2-2/P2-3/P2-5 soient **en ligne** (pas juste
mergées dans `develop`) depuis 4 à 6 semaines — il n'y a rien à mesurer tant que
les pages n'ont pas de requête cible en production.

---

## Gestion de projet

**Linear** — workspace `linear.app/thatmuch`, équipe **« Audit Refonte », clé
`REF`**. Initiative « Génération de leads refonte », 7 projets (un par phase).

**25 tickets créés** (`REF-1` à `REF-25`). Le plafond de 250 issues du plan
gratuit avait bloqué la création après REF-18 le 14/08 ; il s'est libéré depuis
(probablement l'auto-archivage, qui tourne sous 24h) — **REF-19 à REF-25 créés
sans erreur le 17/08**. Les 17 tickets restants (P3 à P6) sont dans
`tickets.json`, à créer au fil de l'eau : retenter, ne pas supposer le plafond
encore atteint.

- Source de vérité : [`linear/tickets.json`](linear/tickets.json)
- Régénération des exports : `node scripts/linear-export.mjs`
- Procédure et câblage GitHub : [`linear/README.md`](linear/README.md)

---

## Outillage

- `npm test` — 24 tests (runner Node natif). Direction des 21 questions, chaque
  question déclare la sienne, maximums par catégorie cohérents avec le mail.
- `node scripts/render-email-preview.mjs` — rend `codeEmailBrevo.html` hors de
  Brevo depuis [`tests/fixtures/profils-email.json`](../tests/fixtures/profils-email.json)
  (huit profils, source unique aussi collable dans un contact de test Brevo).
  Sort en code 1 si un profil devient incohérent (TOTAL qui ne correspond plus à
  la somme des catégories, branche de message qui ne correspond plus au seuil).
- `node scripts/linear-export.mjs` — régénère le CSV et `roadmap-tickets.md`
  depuis `tickets.json`.
- `npx lighthouse <url> --form-factor=mobile --throttling-method=devtools` —
  utilisé pour REF-22, disponible via `npx` sans installation.

---

## Leçons techniques

[`lecons-techniques.md`](lecons-techniques.md) conserve le *pourquoi* de décisions
non évidentes à la seule lecture du code : mass assignment sur la Cloud Function,
arrêt explicite de `ClickSpark`, le SCP qui échoue par intermittence sur les
runners GitHub (relancer avant de « corriger »), le piège `metadataBase`/`basePath`
avec les images Open Graph, et l'incompatibilité Tailwind v4 / Sass.
