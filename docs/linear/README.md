# Linear — import et liaison au code

## 1. Préparer l'espace Linear

Avant d'importer, créer la structure côté Linear — l'importeur ne crée pas les projets
ni les labels, il essaie de les faire correspondre par nom.

**Équipe** — « Audit Refonte », clé `REF` (les issues deviennent `REF-1`, `REF-2`…),
dans le workspace `linear.app/thatmuch`. Équipe distincte de `THATMUCH` : tous les
réglages ci-dessous (estimations, workflow, format de branche, labels) sont scopés à
l'équipe et n'affectent pas l'autre.
La clé apparaît dans les noms de branche et dans les commits : la choisir courte et
définitive, elle n'est pas confortable à changer ensuite.

**Estimations** — `Settings → Team → Estimates` : activer, échelle **Fibonacci**
(1, 2, 3, 5, 8). Sans ça, la colonne `Estimate` du CSV est ignorée.

**Projets** — un par phase, nommés **exactement** comme dans le CSV :

```
Phase 0 — Réparer et mesurer
Phase 1 — Score d'urgence de refonte
Phase 2 — Acquisition
Phase 3 — Restitution et conversion
Phase 4 — Analyse automatique HTML
Phase 5 — PageSpeed
Phase 6 — Analyse visuelle IA (conditionnée)
```

La Phase 6 ne contient qu'un ticket de décision (P6-1) : la créer quand même, elle sert
de rappel mensuel tant que le seuil de volume n'est pas atteint.

Attention aux tirets cadratins (`—`) et à l'esperluette : un caractère qui diffère et
Linear crée un projet en double.

Regrouper ensuite les 6 projets sous une **Initiative** « Génération de leads refonte »
pour obtenir la vue roadmap.

**Labels** — à créer avant l'import :

`bug` · `scoring` · `architecture` · `analytics` · `email` · `test` · `ux`
`frontend` · `backend` · `conversion` · `analyse-auto` · `analyse-visuelle` · `ia`
`pagespeed` · `securite` · `fiabilite` · `cout` · `data` · `seo` · `contenu`
`acquisition` · `perf` · `tech-debt`

⚠️ **`bug` n'existe pas en label d'équipe.** Un label workspace **`Bug`** préexiste
(équipe THATMUCH) et Linear refuse les doublons insensibles à la casse. Les 4 tickets
portant `bug` doivent se rattacher à ce label existant — à confirmer lors de l'import
de test, dont le premier ticket (P0-1) porte précisément ce label.

Les 22 autres sont créés en **labels d'équipe**, pas en labels workspace, pour ne pas
polluer l'espace partagé avec THATMUCH.

**Cycles** — 2 semaines. La Phase 2 court en parallèle des Phases 1 et 3 : la traiter
comme un flux continu plutôt que comme un cycle.

## ⚠️ Plafond du plan gratuit

Le workspace `linear.app/thatmuch` est au **plan gratuit**, dont la limite d'issues
est comptée **à l'échelle du workspace**, pas de l'équipe. L'équipe `THATMUCH` en
occupe déjà la quasi-totalité — la création s'est arrêtée net à `REF-18` avec
« You've exceeded the free issue limit for this workspace ».

Le plafond du plan gratuit est de **250 issues par workspace** (« If you have over
250 issues, you will no longer be able to create new issues »).

**L'archivage manuel n'existe pas dans Linear** — ni par API, ni dans l'UI :
« Archiving happens automatically with no option to manually archive items. »
L'auto-archivage se règle dans `Team settings → Issue statuses & automations`, tourne
sous 24 h, et **n'archive pas une issue close tant que son projet n'est pas clos**.
Ce n'est donc pas un levier fiable pour libérer de la place à la demande.

Deux sorties réelles :

1. **Ne créer les tickets qu'au fil de l'eau.** Les phases 0 et 1 chargées suffisent
   à plusieurs semaines de travail ; `tickets.json` reste la source pour créer la
   suite au moment voulu. C'est l'option retenue par défaut.
2. **Passer le workspace en plan payant.**

## 2. Importer

`Settings → Import / Export → Import issues → CSV`, puis charger
[`linear-import.csv`](linear-import.csv).

Colonnes du fichier : `Title`, `Description`, `Priority`, `Estimate`, `Labels`,
`Project`, `Status`. L'importeur affiche un écran de correspondance — vérifier que les
7 colonnes sont bien mappées avant de valider, les noms attendus varient selon les
versions.

Priorités : `1` Urgent · `2` High · `3` Medium · `4` Low.

**Faire un import de test sur une équipe bac à sable d'abord.** Un import CSV Linear ne
s'annule pas : en cas d'erreur il faut supprimer les 42 issues une par une.

Si aucune équipe bac à sable n'est possible, importer d'abord un CSV réduit à deux
lignes, vérifier le résultat, puis supprimer ces deux issues.

Après import, Linear renumérote tout (`REF-1`…). Le code de référence interne (`P0-1`)
reste dans le titre et en pied de description, ce qui permet de retrouver un ticket
depuis la roadmap.

## 3. Modifier les tickets

Ne pas éditer le CSV ni `roadmap-tickets.md` à la main — ils sont générés.

```bash
node scripts/linear-export.mjs
```

Source de vérité : [`tickets.json`](tickets.json). Le script régénère le CSV et le
markdown. Après le premier import, Linear devient la source vivante ; `tickets.json`
reste utile pour rejouer un import ou documenter la roadmap dans le repo.

## 4. Relier Linear au code

### Intégration GitHub

`Settings → Features → Integrations → GitHub` → connecter **`maarconte/audit-site-web`**.

### Nommage des branches

Le réglage **n'est pas dans les paramètres d'équipe** : il vit dans la page de
l'intégration Git, sous **`Branch format`**, et n'apparaît donc qu'une fois GitHub
connecté. Connecter l'intégration d'abord, régler le format ensuite.

Format par défaut de Linear : `{userName}/{issueIdentifier}-{issueTitle}`, qui produit
des noms très longs sur ce projet — les titres commencent par le code interne
(`P0-1 · …`), déjà porté par l'identifiant. Format retenu : **l'identifiant seul**,
soit `ref-12`.

Linear lie la branche dès qu'elle contient l'identifiant de l'issue, et bascule son
statut au premier push. Rallonger le nom à la main après l'avoir collé ne casse rien.

Voir aussi `Settings → Account → Code & reviews` → **« On git branch copy, move issue
to started status »** : bascule l'issue en statut démarré au moment où l'on copie le
nom de branche (⌥ enfoncé pour l'ignorer ponctuellement).

### Mots-clés dans les PR

Dans la description de la pull request :

| Mot-clé | Effet |
|---|---|
| `Fixes REF-12` | ferme l'issue à la fusion |
| `Closes REF-12` | idem |
| `Part of REF-12` | lie sans fermer — pour une issue découpée en plusieurs PR |
| `Ref REF-12` | lie sans fermer |

### ⚠️ Piège sur ce repo

`main` déploie en production — SCP vers le sous-dossier `/audit-refonte` de
`thatmuch.fr` chez Hostinger ([`.github/workflows/nextjs.yml`](../../.github/workflows/nextjs.yml)) —
et le travail se fait sur `develop`. Par défaut, Linear passe une issue en `Done` dès
qu'une PR est fusionnée — donc à la fusion dans `develop`, alors que **rien n'est
déployé**.

Deux options :

1. Restreindre l'automatisation de fermeture à la branche par défaut dans les réglages
   GitHub de Linear, et faire de la PR `develop → main` l'événement de mise en `Done`.
2. Ajouter un statut `Merged` distinct de `Done` dans le workflow de l'équipe, `Done`
   étant réservé au déploiement effectif.

L'option 2 est plus lisible sur un projet où la mise en production est groupée.

### Messages de commit

Les [règles du repo](../../.agent/rules/git-commit-message-rules.md) imposent
Conventional Commits en texte brut. Les deux conventions se combinent sans conflit —
la référence Linear va dans le corps, jamais dans le titre :

```text
fix(scoring): corriger l'inversion de score sur legal-2

La question sur la visibilite du formulaire de contact attribuait 0
point a "Oui" et 5 a "Non", penalisant les sites correctement equipes.

- Inverser les scores de l'option legal-2
- Ajouter un test de non-regression sur la direction des questions

Refs REF-12
```

Rappel des règles : titre à l'impératif, moins de 72 caractères, pas de point final,
pas de markdown dans le message, corps en puces à 72 colonnes.
