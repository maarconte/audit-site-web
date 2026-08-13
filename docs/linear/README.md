# Linear — import et liaison au code

## 1. Préparer l'espace Linear

Avant d'importer, créer la structure côté Linear — l'importeur ne crée pas les projets
ni les labels, il essaie de les faire correspondre par nom.

**Équipe** — clé suggérée : `REF` (les issues deviennent `REF-1`, `REF-2`…).
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

**Cycles** — 2 semaines. La Phase 2 court en parallèle des Phases 1 et 3 : la traiter
comme un flux continu plutôt que comme un cycle.

## 2. Importer

`Settings → Import / Export → Import issues → CSV`, puis charger
[`linear-import.csv`](linear-import.csv).

Colonnes du fichier : `Title`, `Description`, `Priority`, `Estimate`, `Labels`,
`Project`, `Status`. L'importeur affiche un écran de correspondance — vérifier que les
7 colonnes sont bien mappées avant de valider, les noms attendus varient selon les
versions.

Priorités : `1` Urgent · `2` High · `3` Medium · `4` Low.

**Faire un import de test sur une équipe bac à sable d'abord.** Un import CSV Linear ne
s'annule pas : en cas d'erreur il faut supprimer les 44 issues une par une.

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

`Settings → Integrations → GitHub` → connecter **`maarconte/audit-site-web`**.

### Nommage des branches

`Settings → Team → General → Branch name format`. Format recommandé :

```
{identifier}-{title}
```

Le bouton « Copy git branch name » sur une issue produit alors `ref-12-corriger-l-inversion-de-score`.
Linear reconnaît l'issue au préfixe et bascule automatiquement son statut dès le
premier push.

### Mots-clés dans les PR

Dans la description de la pull request :

| Mot-clé | Effet |
|---|---|
| `Fixes REF-12` | ferme l'issue à la fusion |
| `Closes REF-12` | idem |
| `Part of REF-12` | lie sans fermer — pour une issue découpée en plusieurs PR |
| `Ref REF-12` | lie sans fermer |

### ⚠️ Piège sur ce repo

`main` déploie sur GitHub Pages ([`.github/workflows/nextjs.yml`](../../.github/workflows/nextjs.yml)),
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
