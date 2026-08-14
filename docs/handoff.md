# Reprise de contexte — session du 13/08/2026

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

Quatre causes identifiées dans le code, toutes non corrigées à ce jour :

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

## Fait cette session

**P2-1 — migration en sous-dossier, terminée et vérifiée.**
L'outil est passé de `audit-refonte.thatmuch.fr` (GitHub Pages) à
`https://thatmuch.fr/audit-refonte/`, avec 301 depuis l'ancien sous-domaine.

Commits sur `main` de `audit-site-web` : `basePath` + `trailingSlash`, préfixe des
`url()` SCSS, `.htaccess` de redirection, bascule du déploiement vers Hostinger.
Sur `develop` de `ThatMuch/website` : 3 liens internes, `workflow_dispatch` avec
sélecteur de branche, `ref: main`.

Le détail des sept écarts entre l'analyse initiale et la réalité est consigné dans
[`roadmap.md`](roadmap.md), section « P2-1 — réalisé ».

---

## À reprendre

**Deux restes de la session :**

- Retirer le domaine personnalisé dans `Settings → Pages` de `maarconte/audit-site-web`,
  puis désactiver Pages (cosmétique, GitHub ne sert plus personne).
- **Vérifier que `deploy.yml` a bien été poussé sur `develop`** de `ThatMuch/website`.
  Sans lui, la prochaine publication d'article reconstruit `develop` et efface le
  contenu de `main` — le problème s'est déjà produit une fois.

**Puis la Phase 0** (12 points, une semaine) : P0-1 le mail, P0-2 les dénominateurs,
P0-3 l'inversion `legal-2`, P0-4 l'analytics, P0-5 Search Console, P0-6 le CTA de RDV.
C'est ce qui coûte des leads chaque semaine et rien n'y dépend d'une décision d'infra.

**Deux inconnues qui réordonnent la suite :**

- ~~Search Console (P0-5)~~ **levée le 14/08/2026** : les deux pages sont indexées,
  aucun historique n'existe, la ligne de base démarre maintenant. La Phase 2 reste
  devant la Phase 3, mais P2-2, P2-3 et P2-5 passent devant P2-4 — le goulot est le
  positionnement, pas l'exploration. Détail dans [`roadmap.md`](roadmap.md).
- P2-9 (20 analyses envoyées en prospection) conditionne P4-7 puis P6-1.

---

## Gestion de projet

Linear n'était pas autorisé dans la session. Les 42 tickets sont prêts à importer :

- Source : [`linear/tickets.json`](linear/tickets.json)
- Export CSV : [`linear/linear-import.csv`](linear/linear-import.csv)
- Procédure et câblage GitHub : [`linear/README.md`](linear/README.md)
- Régénération : `node scripts/linear-export.mjs`
