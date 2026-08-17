# REF-19 — paragraphe à ajouter à la politique de confidentialité

Texte à insérer dans `thatmuch.fr/politique-de-confidentialite/`, **à la suite de la
section 10 « Cookies et consentement »**, sans rien retirer de l'existant.

Chaque affirmation ci-dessous est vérifiable dans le code — les références sont
données en fin de document pour la relecture, elles ne font pas partie du texte à
publier.

---

## Texte à publier

### Cas particulier de l'outil d'audit (thatmuch.fr/audit-refonte)

L'outil d'auto-analyse accessible sur `thatmuch.fr/audit-refonte` **n'utilise ni
Axeptio ni Hotjar**. Il dispose de son propre bandeau de consentement : le
paragraphe ci-dessus ne s'y applique pas.

**Aucune mesure avant votre accord.** Tant que vous n'avez pas accepté, l'outil de
mesure n'est pas chargé : aucun cookie de mesure n'est déposé sur votre appareil et
aucune donnée n'est transmise. Si vous refusez, rien n'est envoyé. Après
acceptation, la mesure dépose les cookies de Google Analytics.

**Ce que nous mesurons, si vous acceptez.** Nous utilisons Firebase Analytics
(Google Analytics 4) pour comprendre comment l'outil est utilisé : pages
consultées, démarrage et progression du questionnaire, envoi du formulaire,
consultation du résultat et clics vers la prise de rendez-vous. Ces événements
comportent l'étape concernée et le score obtenu, **jamais votre nom, votre adresse
e-mail ni l'adresse de votre site**. Ces informations-là, que vous nous transmettez
volontairement via le formulaire, sont traitées séparément, aux finalités décrites
aux sections 3 et 4.

**Comment votre choix est conservé.** Votre réponse au bandeau est enregistrée dans
le stockage local de votre navigateur, et non dans un cookie. Elle reste sur votre
appareil et ne nous est jamais transmise.

**Comment revenir sur votre choix.** Le lien « Gérer mes préférences de mesure », en
bas de chaque page de l'outil, efface votre réponse : le bandeau réapparaît et la
mesure s'arrête immédiatement, sans attendre un rechargement de la page.

---

## Modification connexe, section 3 — tableau des services

Le tableau « Outils et services utilisés » liste Google Analytics, Hubspot, Brevo,
Hotjar et Axeptio.

> **Le manque le plus sérieux n'est pas la mesure d'audience.** Les données du
> formulaire — prénom, nom, adresse e-mail, adresse du site et scores — sont
> écrites dans **Firestore** par une Cloud Function, avant même l'envoi vers
> Brevo (`functions/src/index.ts`, collection `submissions`). Google est donc
> sous-traitant de la donnée personnelle la plus identifiante que l'outil
> collecte, et **il n'apparaît nulle part au tableau à ce titre**. La ligne
> « Google Analytics » ne couvre que la mesure d'audience.

### Lignes à ajouter

| Service | Finalité principale | Lieu de traitement des données |
| --- | --- | --- |
| Firebase Analytics (Google) | Mesure d'usage de l'outil d'audit, soumise à votre consentement | UE/États-Unis |
| Firebase — Firestore et Cloud Functions (Google) | Enregistrement et traitement des demandes d'audit envoyées via le formulaire | États-Unis |

### Ce qui est vérifié, et ce qui ne l'est pas

- **Cloud Functions : `us-central1`, donc États-Unis.** Vérifié le 17/08/2026 par
  le suffixe `-uc` de l'URL de la fonction déployée
  (`https://submitform-…-uc.a.run.app`). C'est là que transitent prénom, nom,
  e-mail et URL.
- **Firestore : emplacement non vérifié.** Les identifiants Firebase de la session
  n'étaient plus valides. Par défaut un projet créé avec une fonction en
  `us-central1` a sa base en `nam5` (multirégion États-Unis), mais **ça reste une
  supposition** : à confirmer dans la console Firebase, projet `quizzref-9a79b`,
  avant publication. Si la base est en `eur3`, écrire « UE » plutôt que
  « États-Unis ».

### Autre ajustement

- **Préciser la portée de Hotjar et Axeptio** — ils ne tournent que sur le site
  principal, pas sur `/audit-refonte`.

---

## Justification de chaque affirmation

À usage interne, pour la relecture. Ne pas publier.

| Affirmation | Où c'est vérifiable |
| --- | --- |
| Rien n'est chargé ni déposé avant consentement | `src/utils/analytics.ts` — `demarrerMesure()` n'est appelée que par `accepterMesure()` et `restaurerConsentement()` ; `getAnalytics` n'est jamais invoqué avant |
| Un refus n'envoie rien | `refuserMesure()` vide la file d'attente et appelle `setAnalyticsCollectionEnabled(false)` |
| Liste des événements | `EVENEMENTS` dans `src/utils/analytics.ts` — 8 événements du tunnel |
| Les événements ne portent ni nom, ni e-mail, ni URL | paramètres réellement passés à `suivre()` : `index`, `slug`, `score`, `score_total`, `emplacement`, `page_path`, `nombre_categories` |
| Le choix est en stockage local, pas en cookie | `window.localStorage.setItem(CLE_CONSENTEMENT, …)`, clé `thatmuch-consentement-mesure` |
| Le retrait est immédiat et sans rechargement | `oublierChoixConsentement()` notifie les abonnés, la bannière revient via `useSyncExternalStore` |
| Le lien est en bas de chaque page de l'outil | `ConsentSettingsLink` monté dans `app/page.tsx` et `app/refonte-form/RefonteFormClient.tsx` |

**Attention à ne pas surpromettre.** Le texte dit « aucun cookie de mesure » *tant
que* l'accord n'est pas donné. Après acceptation, GA4 dépose bien ses cookies — d'où
la dernière phrase du premier point, à ne pas retirer.
