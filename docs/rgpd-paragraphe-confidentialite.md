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

## Modification connexe, section 3

Le tableau « Outils et services utilisés » liste Google Analytics, Hubspot, Brevo,
Hotjar et Axeptio. Deux ajustements le rendraient exact :

- **Ajouter une ligne** — `Firebase Analytics (GA4) · Mesure d'usage de l'outil
  d'audit · UE/États-Unis`. La ligne « Google Analytics » existante couvre la
  finalité, mais nomme un service que l'outil n'appelle pas directement.
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
