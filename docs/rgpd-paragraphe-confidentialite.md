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
| Firebase Firestore (Google) | Enregistrement des demandes d'audit envoyées via le formulaire | UE |
| Google Cloud Functions (Google) | Traitement du formulaire et transmission vers Brevo | États-Unis |

Trois lignes plutôt que deux : le stockage et le traitement n'ont pas lieu au même
endroit, et les fondre en un « UE/États-Unis » ferait perdre l'information utile.
Les données **sont stockées en Europe**, mais **transitent par les États-Unis**.

### Ligne à retirer

**Hotjar.** Confirmé absent du site le 17/08/2026 : `window.hj` est indéfini et
aucun script Hotjar n'est chargé. Il ne reste qu'un `<link rel="preconnect">` vers
`content.hotjar.io` dans le `<head>` — un vestige, qui déclenche encore une
résolution DNS et une poignée de main TLS inutiles à chaque page. Idem pour un
preconnect vers `consent.cookiebot.com`, alors que Cookiebot n'est pas utilisé.
À nettoyer côté `ThatMuch/website`, sans rapport avec le RGPD.

### Ce qui a été vérifié, et comment

Relevé du 17/08/2026, à l'exécution dans un navigateur — le HTML statique seul
induit en erreur, les preconnect y ressemblent à des intégrations actives.

| Constat | Méthode |
| --- | --- |
| Firestore en `europe-west1`, donc **UE** | API Firebase, projet `quizzref-9a79b` — `locationId: europe-west1` |
| Cloud Functions en `us-central1`, donc **États-Unis** | suffixe `-uc` de l'URL de la fonction déployée |
| Hotjar **absent** | `window.hj` indéfini, aucun script `hotjar` chargé |
| Axeptio **bien présent** | `static.axept.io/sdk.js` chargé, cookies `axeptio_cookies`, `axeptio_authorized_vendors`, `axeptio_all_vendors` |
| GA4 et GTM présents | `G-EGCDBV43KT`, `GTM-W2WV9WGR`, cookies `_ga` |
| HubSpot présent, au-delà du CRM | `hs-banner.js`, `hscollectedforms.js`, `hs-analytics.js`, cookies `__hstc`, `hubspotutk`, `__hssrc`, `__hssc` |

**La mention d'Axeptio dans la politique est donc juste** pour le site principal —
c'est bien son périmètre qui était mal décrit, pas son existence.

> **Un point non tranché, hors périmètre de ce ticket.** Les cookies `_ga` et
> `__hstc` étaient déjà posés au chargement de la page, avant toute interaction
> avec le bandeau Axeptio. Ça peut venir d'un choix mémorisé lors d'une visite
> antérieure du navigateur de test, ou d'un dépôt avant consentement — le second
> cas serait un vrai défaut. **À vérifier en navigation privée** avant d'en
> conclure quoi que ce soit.

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
