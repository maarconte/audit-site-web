# Roadmap — optimisation de l'outil d'auto-analyse

**Contexte.** Agence THATMUCH. Vend du **design sur WordPress**, cible **PME**, ancrage
**Paris / Île-de-France**, panier **2000-3000 €**. Outil en ligne depuis un an :
**moins de 10 soumissions, 0 RDV, aucun analytics installé.** Budget infra 10 €/mois.
Une personne, assistée par IA.

- **42 tickets · 145 points · 6 phases planifiées + 1 conditionnée**
- Détail des tickets : [`docs/roadmap-tickets.md`](roadmap-tickets.md)
- Source de vérité : [`docs/linear/tickets.json`](linear/tickets.json)
- Import Linear : [`docs/linear/README.md`](linear/README.md)

---

## Le diagnostic

Trois constats issus du code, qui expliquent probablement à eux seuls les 0 RDV.

### 1. Le mail dit aux leads de ne pas faire de refonte

Dans [`codeEmailBrevo.html`](../codeEmailBrevo.html) :

```
{% if contact.TOTAL >= 66 %}
  Félicitations ! Votre site tient encore la route, une refonte n'est pas urgente.
  Quelques ajustements ciblés suffiraient.
{% endif %}
```

Suivi, quelques blocs plus bas, d'un bouton « Prendre RDV ». Le produit dissuade puis
sollicite.

### 2. Deux dénominateurs du mail sont faux

Maximums recalculés depuis `src/data/questionquiz.json` le 14/08/2026, à l'occasion
de P0-2 :

| Affiché | Maximum réel | Verdict |
|---|---|---|
| Marketing **/10** | **15** | faux — un lead pouvait recevoir « 12/10 » |
| Légalité & Accessibilité **/20** | **15** | faux |
| `{{ TOTAL }}/100` | **100** | juste |
| Design /15 · UX /15 · SEO /10 · Performance /15 · Tech /15 | conformes | justes |

**Correction d'une erreur de la version précédente de ce document**, qui annonçait un
maximum de 17 pour Marketing et un TOTAL sur 102. Le total et les seuils 33 et 66
étaient donc justes depuis le début, et les seuils de couleur par catégorie sont eux
aussi proportionnés — SEO utilise 6/3 sur 10 là où les autres utilisent 10/5 sur 15.

Corrigé dans `codeEmailBrevo.html` (P0-2).

### 3. Rien n'est mesuré, et ne l'a jamais été

[`src/utils/firebase.ts`](../src/utils/firebase.ts) n'initialise que Firestore.
`getAnalytics` n'est appelé nulle part, aucun `gtag` dans le code. Le `measurementId`
est en configuration mais jamais consommé. **Il n'y a aucune donnée depuis un an** —
impossible de savoir si le goulot est l'acquisition, le tunnel ou la restitution.

### Et un quatrième, structurel

Le tunnel se termine sur « L'analyse vous attend dans votre boîte mail ». **Il n'existe
aucun chemin vers la prise de RDV dans le produit lui-même.** Le seul bouton est dans le mail,
sous le message qui dit que la refonte n'est pas urgente. 0 RDV n'a rien de surprenant :
le produit n'en demande jamais.

---

## Ce que ça change dans le plan

La version précédente de cette roadmap optimisait la **qualité de l'analyse**. C'était
le mauvais problème : ajouter de la vision IA à un outil qui reçoit dix personnes par
an, c'est optimiser une machine sans entrée.

Deux corrections de cap :

- **L'acquisition passe en Phase 2** au lieu d'être un chantier parallèle secondaire.
  À <10 soumissions/an, c'est le goulot le plus probable.
- **L'analyse visuelle IA sort du planning.** Elle devient la Phase 6, **conditionnée à
  un seuil de volume** (P6-1). C'est le différenciateur le plus aligné avec ce qui est
  vendu — du design — mais il n'a aucun sens avant d'avoir du trafic.

---

## Séquencement

```
S1      P0 ████          Réparer et mesurer              12 pts  ← le meilleur ratio
S2-3    P1 ████████      Score d'urgence de refonte      29 pts
S2-8    P2 ██████████    Acquisition                     39 pts  ← le goulot probable
S6-8    P3 ██████        Restitution et conversion       21 pts
S9-11   P4 █████████     Analyse automatique HTML        33 pts
S12-13  P5 ███           PageSpeed                       10 pts
—       P6 ·             Analyse visuelle IA          conditionnée
```

**Phase 0 en semaine 1.** 12 points pour corriger un mail qui dissuade, deux
dénominateurs faux, un score inversé, brancher l'analytics et poser un CTA de prise de RDV.
C'est de loin le meilleur rapport valeur/effort de tout le plan, et **P0-4 et P0-5
conditionnent la priorisation de tout le reste** : sans mesure, on ne saura pas si les
phases suivantes servent à quelque chose.

**Phase 1 : le scoring**, comme prévu — mais avec deux changements majeurs issus de tes
réponses (voir ci-dessous).

**Phase 2 en parallèle dès la semaine 2.** Le SEO met 4 à 6 mois à produire : le lancer
en semaine 2 plutôt qu'en semaine 9 fait gagner deux mois d'indexation sans coûter un
jour de chemin critique. Et **P2-9 ouvre un canal à effet immédiat**, parce qu'attendre
le SEO signifierait une année de plus sans lead.

---

## Décisions actées

| Sujet | Décision | Ticket |
|---|---|---|
| **Sens du score** | **100 = urgence de refonte maximale.** Toutes les questions à réécrire | P1-1 |
| **Pondération** | `design 30 · ux 22 · seo 18 · performance 15 · technique 15` — le design domine parce que c'est l'offre | P1-2 |
| **Calibration** | Impossible sur l'historique (<10 soumissions) → **panel manuel de 15 sites PME parisiens + 5 profils bornes** | P1-6 |
| **Rang comparatif** | **Retiré** — « mieux que X% » exige une base ; réactivé à 50 soumissions | P3-3 |
| RGPD | Hors score, en alertes binaires | P1-3 |
| Marketing | Hors score, devient multiplicateur d'urgence | P1-4 |
| Gate email | **Conservé** — score partiel affiché, détail par mail | P3-2 |
| CTA | **HubSpot Meetings**, à chaque point de sortie, différencié par palier | P0-6, P3-4 |
| Bootstrap | **Retiré**, migration Tailwind (déjà installé) | P2-7 |
| Requêtes SEO | **Pas « refonte site web »** en cible directe — voir ci-dessous | P2-2 |
| Vision IA | Conditionnée à 30 soumissions/mois sur 2 mois | P6-1 |

### Sur « refonte site web »

Tu veux que ce mot-clé te ramène des clients. Je dois être franche : c'est une **requête
de tête**, verrouillée par des agences installées et des annuaires à fort historique.
Un sous-domaine neuf, sans contenu ni backlinks, ne la prendra pas — viser cette
requête directement, c'est investir dans un objectif hors de portée à 12 mois.

Le chemin réaliste, et il joue sur tes deux atouts (WordPress + Paris) :

```
refonte site wordpress paris   ·   refonte site internet pme paris
refonte site vitrine paris     ·   prix refonte site wordpress
refaire son site wordpress
```

« refonte site web » reste l'objectif de long terme, atteint **par accumulation** —
c'est une conséquence, pas une cible de page d'accueil.

### Sur le domaine (P2-1)

L'outil est sur `https://audit-refonte.thatmuch.fr/`. Le site principal est un
**headless Gatsby + WordPress** chez Hostinger — donc statique en sortie, comme l'outil.

Trois options, et une seule est mauvaise :

| Option | Autorité de départ | Verdict |
|---|---|---|
| Domaine propre | Zéro | **Non** — aucun bénéfice, repart de rien |
| Sous-domaine *(actuel)* | Partielle, via le maillage déjà en place | Défendable |
| Sous-dossier `thatmuch.fr/audit-refonte/` | Complète | **Recommandé** |

L'argument décisif n'est pas le SEO générique, c'est que **le contenu à venir**
(P2-5, P2-8, landings verticales) compose avec les articles refonte existants sur le
domaine principal, alors qu'il bâtit un second îlot plus faible sur un sous-domaine.
Et le moment est le moins cher possible : trafic et positions quasi nuls.

**Passer en sous-dossier ne fusionne pas les codebases.** Deux repos, deux builds,
deux pipelines, `npm run dev` inchangé sur audit-refonte seul. Seuls le `basePath` et
la cible de déploiement changent.

**Faisabilité vérifiée sur le repo `thatmuch` — feu vert :**

| Point | Résultat |
|---|---|
| Le déploiement Gatsby efface-t-il `public_html` ? | **Non.** `appleboy/scp-action` écrase et ajoute, ne supprime jamais (`rm` non activé). Le sous-dossier survivra. |
| `.htaccess` | **Aucun risque.** Uniquement du cache, aucune réécriture — et ses règles conviennent à un export Next. |
| `gatsby-plugin-offline` | **Seul obstacle.** Actif en config par défaut → `navigateFallbackDenylist` à ajouter (5 lignes). |

Deux détails relevés au passage : `deploy.yml` ne se déclenche que sur
`repository_dispatch`, il faut ajouter `workflow_dispatch` pour pouvoir redéployer à la
main. Et **GTM est déjà configuré sur `thatmuch.fr`** — en sous-dossier, le même
conteneur donne un funnel unifié dans un seul GA4, ce qui simplifie P0-4.

### P2-1 — réalisé le 13/08/2026

L'outil est servi depuis `https://thatmuch.fr/audit-refonte/`, et
`audit-refonte.thatmuch.fr` redirige en 301 en préservant le chemin.

Ce que la migration a révélé, et qui n'était pas dans l'analyse initiale :

| Point | Réalité |
|---|---|
| **Deux pipelines** écrivaient dans `public_html` | Web App Hostinger (depuis `main`) + GitHub Actions SCP (depuis `develop`). Ils s'écrasaient : le parallax d'une release a disparu sous nos yeux. Corrigé par `ref: main` dans `deploy.yml`. |
| Chemin `/refonte-site-web/` | **Déjà occupé** par un article publié. Retenu : `/audit-refonte/`. |
| `gatsby-plugin-offline` | Aucune configuration nécessaire — sa `NavigationRoute` retombe sur `fetch()` pour tout chemin inconnu. Le « piège » anticipé n'existait pas. |
| Apache vs GitHub Pages | Apache ne résout pas les URL sans extension → `trailingSlash: true`. |
| `url()` du SCSS | Non préfixées par `basePath` → `$base-path` dans `_vars.scss`. |
| Sous-domaine et URL canonique | **Même dossier** côté hPanel → le 301 doit être conditionné à `HTTP_HOST`, sinon boucle. |
| `source: "out/*"` en SCP | Ne matche pas les dotfiles → `.htaccess` listé explicitement. |

**Leçon de méthode** : la faisabilité avait été validée en lisant le seul workflow
présent dans le repo. Le pipeline qui déployait réellement la production n'y était pas.
Vérifier le dépôt ne remplace pas demander comment le déploiement fonctionne.

### Sur le budget de 10 €/mois

Il n'est **pas** contraignant à ton volume — c'est une bonne nouvelle :

| Poste | Coût réel |
|---|---|
| Firebase Blaze | ~0 € (offre gratuite couvre largement <100 analyses/mois) |
| PageSpeed API | 0 € (25 000 req/jour avec clé) |
| API Anthropic | 0,30 à 1,50 €/mois à ce volume |
| Capture d'écran tierce | **17 €/mois minimum → hors budget** |

Seul le service de capture tiers sort du cadre. Si la Phase 6 s'ouvre un jour, ce sera
Playwright sur Cloud Run (gratuit à ce volume, mais à maintenir). **La vraie contrainte
n'est pas l'argent, c'est ton temps.**

---

## Points de vigilance

**Sécurité (P4-2, avant P4-3).** Un endpoint public qui va chercher une URL fournie par
l'utilisateur est un SSRF livré clé en main et une facture Cloud Functions ouverte à qui
veut. Avec 10 €/mois de budget, une facture qui dérape n'est pas abstraite. App Check,
rate limit, blocage des IP privées et de `169.254.169.254`, revalidation à chaque
redirection, **et une alerte de facturation GCP à 10 €**.

**Le champ URL en tête de tunnel (P4-1)** peut faire fuir. C'est le bon choix
architectural, mais l'effet sur l'abandon à l'étape 1 doit être mesuré avant/après.

**Wix est fréquent chez les PME (P4-4).** Un site Wix renvoie un DOM quasi vide : sans
détection, l'outil annoncerait « aucun contenu » à des sites corrects. Tolérance zéro
sur le factuel.

---

## Critères de décision

1. **Qualité du lead > volume.** À 2500 € de panier, 3 leads qualifiés par mois suffisent.
2. **Le temps est la ressource rare, pas l'argent.** Le budget de 10 € ne bloque rien ;
   145 points en solo, si.
3. **Ne rien afficher qui ne soit défendable** face au prospect avec son dev dans la salle.
4. **Ne rien construire qu'on ne puisse mesurer** — d'où la Phase 0 en premier.
5. **Latence perçue > latence réelle.** 45 s passent bien si l'écran raconte.

---

## P0-5 — relevé Search Console du 14/08/2026

### Les deux pages sont indexées

`https://thatmuch.fr/audit-refonte/` et `.../refonte-form/` : **« L'URL est sur
Google »** à l'inspection. Elles répondent en 200, sans balise `noindex`, et le
`robots.txt` de thatmuch.fr n'interdit rien.

**L'hypothèse « Google ne trouve pas l'outil » est écartée.** Le goulot n'est pas
l'exploration mais le **positionnement** : les pages sont dans l'index et ne se
classent sur rien — cohérent avec une page d'accueil d'environ 150 mots, sans
requête cible ni `title` travaillé.

### Il n'existe aucun historique de recherche

| Propriété | État |
|---|---|
| `audit-refonte.thatmuch.fr` | **n'a jamais existé** |
| `thatmuch.fr` (domaine) | non vérifiée jusqu'au 14/08/2026 |
| `https://thatmuch.fr/audit-refonte/` | vérifiée, mais **récente** — « traitement des données en cours » |

Search Console ne collecte que pour une propriété vérifiée et **ne reconstitue
jamais le passé**. L'année du sous-domaine n'a donc été enregistrée nulle part et
n'est pas récupérable. **La ligne de base démarre au 14/08/2026**, en même temps que
l'instrumentation de P0-4. L'outil a tourné un an entièrement à l'aveugle, côté
produit comme côté recherche.

Un jeton de vérification a été ajouté en TXT sur `thatmuch.fr` le 14/08/2026, en
ajout des trois valeurs existantes (SPF, Stripe, vérification Google préexistante).
Il consolidera les sous-domaines sous une seule propriété, sans effet rétroactif.

### Ce que ça décide

**La Phase 2 reste devant la Phase 3.** Le scénario qui l'aurait inversée — du trafic
qui ne convertit pas — est exclu : il n'y a pas de trafic de recherche.

Mais **la composition de la Phase 2 change**. Les pages étant déjà indexées :

- **P2-4** (sitemap, robots.txt) perd son caractère urgent — de l'hygiène, pas le
  goulot. L'outil reste absent des 127 URL du sitemap de thatmuch.fr, à corriger,
  sans que ce soit ce qui bloque.
- **P2-2** (requêtes atteignables), **P2-3** (métadonnées) et **P2-5** (contenu sous
  le pli) portent l'enjeu réel : donner aux pages indexées quelque chose sur quoi se
  classer.

### À refaire dans 24 h

Le rapport Performances était en cours de traitement au moment du relevé. Y revenir
pour noter impressions, clics, position moyenne et premières requêtes — la vraie
valeur de départ.

---

## Ce qui reste à lever
- **P2-9** (20 analyses manuelles envoyées en prospection) est le test le moins cher de
  la pertinence du score, et il **conditionne P4-7 puis P6-1**.
- **Cas clients (P2-8)** : tu as dit pouvoir en obtenir. Il en faut deux, avec chiffres
  et accord écrit.
