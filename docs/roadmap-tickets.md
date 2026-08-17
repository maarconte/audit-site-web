# Détail des tickets

> Fichier généré par `scripts/linear-export.mjs`. Ne pas éditer à la main :
> modifier `docs/linear/tickets.json` puis relancer le script.

## Phase 0 — Réparer et mesurer

**Semaine 1** · 6 tickets · 12 points

**Objectif** — Arrêter l'hémorragie : le mail dit aux leads que leur refonte n'est pas urgente, les dénominateurs sont faux, et rien n'est mesuré. Le meilleur rapport valeur/effort de toute la roadmap.

**Condition de sortie** — Un lead qui termine le quiz reçoit un message cohérent avec l’offre, avec un chemin vers la prise de RDV, et chaque étape du tunnel est mesurée.

### P0-1 · Corriger le message du mail qui dissuade la refonte

`Urgent` · `2 pts` · `bug` `conversion` `email`

**Contexte**

codeEmailBrevo.html contient : {% if contact.TOTAL >= 66 %} « Félicitations ! Votre site tient encore la route, une refonte n'est pas urgente. » C'est l'inverse exact de la direction retenue pour le score. Un mail qui félicite le prospect puis affiche un bouton « Prendre RDV » ne peut pas convertir. C'est l'explication mécanique la plus probable des 0 RDV en un an.

**Spécification**

- Réécrire les trois branches de message dans le sens « urgence de refonte » : un score élevé signifie désormais que la refonte est urgente.
- Aucune branche ne doit conclure qu'une refonte est inutile : au pire elle est différable, avec un axe précis à travailler.
- Faire remonter le bouton de prise de RDV HubSpot au-dessus du détail par catégorie.
- Reformuler « Ce score est une indication basée sur vos réponses » : c'est une décharge qui affaiblit tout ce qui précède.

**Critères d'acceptation**

- [ ] Aucune branche du mail ne contient « une refonte n'est pas urgente » ni « Félicitations ».
- [ ] Le CTA de prise de RDV est visible sans défilement sur mobile.
- [ ] Les trois branches sont testées avec un contact de test dans Brevo.

**Fichiers concernés**

- `codeEmailBrevo.html`

---
Réf. interne : `P0-1` · Dépendances : aucune

### P0-2 · Corriger les dénominateurs faux du mail

`Urgent` · `1 pts` · `bug` `email`

**Contexte**

Le mail affiche « Marketing /10 pts » alors que le maximum réel est 15 : un lead peut recevoir « 12/10 ». Il affiche « Légalité & Accessibilité /20 pts » alors que le maximum est également 15. Maximums recalculés depuis src/data/questionquiz.json : design 15, ux 15, marketing 15, seo 10, performance 15, technique 15, legal 15, soit un TOTAL de 100. Le {{ contact.TOTAL }}/100 et les seuils 33 et 66 sont donc justes, contrairement à ce qu’annonçait la première analyse (qui parlait de 102 et d’un max marketing de 17).

**Spécification**

- Corriger Marketing en /15 et Légalité en /15.
- Ne pas toucher au TOTAL ni aux seuils 33 et 66 : ils sont corrects.
- Les seuils de couleur par catégorie sont déjà proportionnés (SEO 6/3 sur 10, les autres 10/5 sur 15) — rien à faire de ce côté.
- La normalisation générale sur 100 reste du ressort de P1-2.

**Critères d'acceptation**

- [ ] Aucun score affiché ne peut dépasser son dénominateur.
- [ ] Chaque dénominateur correspond au maximum réel calculé depuis questionquiz.json.

**Fichiers concernés**

- `codeEmailBrevo.html`
- `functions/src/index.ts:106-112`

---
Réf. interne : `P0-2` · Dépendances : aucune

### P0-3 · Corriger l'inversion de score sur la question legal-2

`Urgent` · `1 pts` · `bug` `scoring`

**Contexte**

La question « Mon site a-t-il un email ou un formulaire de contact clairement visible ? » attribue 0 point à « Oui » et 5 à « Non ». Le sens est inversé.

**Spécification**

- Inverser les scores, en cohérence avec la direction retenue en P1-1.
- Relire l'ensemble du fichier pour vérifier qu'aucune autre question n'est inversée.

**Critères d'acceptation**

- [ ] La direction de legal-2 est cohérente avec la définition du score.
- [ ] Un test de non-régression couvre le sens de chaque question.

**Fichiers concernés**

- `src/data/questionquiz.json:381-391`

---
Réf. interne : `P0-3` · Dépendances : aucune

### P0-4 · Installer l'instrumentation analytics

`Urgent` · `3 pts` · `analytics` `bug`

**Contexte**

Aucun analytics n'est installé. src/utils/firebase.ts n'initialise que Firestore, getAnalytics n'est appelé nulle part et aucun gtag n'existe dans le code. Le measurementId est présent en configuration mais jamais consommé. Il n'y a donc aucune donnée depuis un an — impossible de savoir si le problème est l'acquisition, le tunnel ou la restitution.

**Spécification**

- Initialiser Firebase Analytics (getAnalytics, avec isSupported pour le rendu statique).
- Événements : page_view, quiz_start, quiz_step_completed (index, slug), quiz_completed, result_viewed, contact_form_viewed, lead_submitted, meeting_link_clicked.
- N'activer qu'après consentement, en cohérence avec la politique de confidentialité.
- Vérifier la remontée en temps réel dans la console Firebase avant de fermer le ticket.

**Critères d'acceptation**

- [ ] Un parcours complet produit tous les événements attendus dans la console Firebase.
- [ ] Le taux d'abandon par étape du quiz devient lisible.
- [ ] Aucun événement n'est envoyé avant consentement.

**Fichiers concernés**

- `src/utils/firebase.ts`
- `app/refonte-form/RefonteFormClient.tsx`

---
Réf. interne : `P0-4` · Dépendances : aucune

### P0-5 · Brancher Search Console et vérifier l'indexation

`Urgent` · `2 pts` · `analytics` `seo`

**Contexte**

Sans Search Console, impossible de savoir si la page est seulement indexée. Avec moins de 10 soumissions en un an, l'hypothèse la plus probable est qu'elle ne reçoit quasiment aucune visite — mais c'est une hypothèse tant qu'elle n'est pas vérifiée.

**Spécification**

- Ajouter la propriété dans Search Console et valider la propriété.
- Vérifier l'indexation de la page d'accueil et du tunnel.
- Relever les impressions et les positions moyennes actuelles : c'est la ligne de base.
- Documenter le résultat dans docs/roadmap.md — il conditionne l'ordre des Phases 2 et 3.

**Critères d'acceptation**

- [ ] La propriété est validée et les données remontent.
- [ ] Le statut d'indexation de chaque page est connu et documenté.

**Fichiers concernés**

- `docs/roadmap.md`

---
Réf. interne : `P0-5` · Dépendances : aucune

### P0-6 · Ajouter un chemin vers la prise de RDV à chaque point de sortie

`Urgent` · `3 pts` · `conversion`

**Contexte**

Le tunnel se termine aujourd’hui sur « L’analyse vous attend dans votre boîte mail ». Il n’existe aucun chemin vers une prise de RDV dans le produit lui-même : le seul lien de réservation (HubSpot Meetings, https://meetings-eu1.hubspot.com/mathilde-arconte) est dans le mail, sous un message qui dit que la refonte n’est pas urgente. 0 RDV en un an n’a rien de surprenant — le produit n’en demande jamais.

**Spécification**

- Ajouter le CTA de prise de RDV (lien HubSpot Meetings) sur l’écran de confirmation après soumission.
- Ajouter un CTA secondaire sur la page d'accueil, sous le contenu.
- Instrumenter meeting_link_clicked (P0-4) sur chaque emplacement pour comparer.
- Formuler le CTA sur le bénéfice, pas sur l'acte : « Faire relire mon score par un designer, 30 min » plutôt que « Prendre rendez-vous ».

**Critères d'acceptation**

- [ ] Un lead qui termine le quiz a un accès au lien de RDV sans passer par le mail.
- [ ] Chaque emplacement de CTA est mesuré séparément.

**Fichiers concernés**

- `src/components/LandingRefonte/ContactForm/ContactForm.tsx:154-163`
- `app/page.tsx`

---
Réf. interne : `P0-6` · Dépendances : P0-4

## Phase 1 — Score d'urgence de refonte

**Semaines 2-3** · 8 tickets · 29 points

**Objectif** — Inverser le sens du score, le normaliser, le pondérer sur ce qui est réellement vendu (design sur WordPress), et le calibrer sans données historiques.

**Condition de sortie** — Le score est sur 100, 100 = urgence maximale, design est l'axe dominant, et la calibration est vérifiée sur un panel de sites réels.

### P1-1 · Inverser le sens du score vers l'urgence de refonte

`Urgent` · `5 pts` · `scoring` `architecture`

**Contexte**

Le score mesure aujourd'hui la santé du site : 100 = tout va bien = pas besoin de refonte. Un outil de génération de leads sur la refonte qui félicite ses visiteurs se tire une balle dans le pied. Le score doit désormais mesurer l'urgence de refonte : 100 = urgence maximale.

**Spécification**

- Inverser la direction de chaque option des 21 questions, question par question.
- Attention aux questions déjà ambiguës : marketing-3 (« je souhaite ajouter des pages ») devient une urgence forte, technique-1 (Wix, « je ne sais pas ») devient une urgence forte, WordPress devient une urgence faible.
- Ne pas se contenter d'un 5 moins score : plusieurs questions ont des échelles incohérentes (marketing-1 plafonne à 3, marketing-4 à 2).
- Homogénéiser toutes les échelles sur 0-5.
- Reformuler les libellés de restitution : on ne dit plus « votre site va bien », on dit « rien n'appelle une refonte immédiate sur cet axe ».

**Critères d'acceptation**

- [ ] Toutes les options sont sur une échelle 0-5 homogène.
- [ ] Un site en excellent état produit un score proche de 0, un site à refondre un score proche de 100.
- [ ] Un test couvre la direction de chacune des 21 questions.

**Fichiers concernés**

- `src/data/questionquiz.json`

---
Réf. interne : `P1-1` · Dépendances : P0-3

### P1-2 · Créer le moteur de score normalisé et pondéré design-dominant

`Urgent` · `5 pts` · `scoring` `architecture`

**Contexte**

Le score est une somme brute sur 100 points (functions/src/index.ts:106-112) avec une pondération accidentelle : marketing pèse 15 % et SEO 10 % parce qu’il y a 4 questions d’un côté et 2 de l’autre. Or l’offre vendue est du design sur WordPress : c’est l’axe design qui doit dominer le score, pas le hasard du nombre de questions.

**Spécification**

- Créer src/lib/scoring/, module pur sans dépendance React ni Firebase, importable côté client et côté Cloud Function.
- Normaliser chaque catégorie sur 100 à partir du max théorique dérivé des données, jamais codé en dur.
- Pondération : design 30, ux 22, seo 18, performance 15, technique 15. Total 100.
- Le design domine parce que c'est l'offre vendue ; technique conserve 15 parce qu'un site Wix ou un WordPress non maintenable est un déclencheur direct de refonte.
- Exposer SCORE_VERSION et retourner { version, global, categories: { slug: { raw, max, normalized, weight } }, alerts, urgency }.
- Prévoir dès maintenant les entrées mesurées des Phases 4 et 5, avec un champ source par constat.

**Critères d'acceptation**

- [ ] Ajouter une question ne modifie pas le poids de sa catégorie.
- [ ] La somme des poids vaut 100.
- [ ] Le module est une fonction pure, sans effet de bord.

**Fichiers concernés**

- `src/lib/scoring/`
- `functions/src/index.ts:106-112`

---
Réf. interne : `P1-2` · Dépendances : P1-1

### P1-3 · Sortir le RGPD du score et le transformer en alertes

`High` · `3 pts` · `scoring`

**Contexte**

Le RGPD n'est pas une note, c'est conforme ou pas. Noyé dans un score, un manquement perd toute force ; en alerte nommée, il devient un argument de vente immédiat auprès d'une PME.

**Spécification**

- Retirer legal de la pondération.
- Produire alerts : [{ id, severity: 'critique' | 'attention', label, explication }].
- Absence de politique de confidentialité et absence de gestion des cookies = critique.
- Prévoir l'affichage en bandeau distinct du score, dans le site comme dans le mail.

**Critères d'acceptation**

- [ ] Le score ne contient plus aucun point RGPD.
- [ ] Un site sans politique de confidentialité remonte une alerte critique.

**Fichiers concernés**

- `src/lib/scoring/`
- `src/data/questionquiz.json:357-408`

---
Réf. interne : `P1-3` · Dépendances : P1-2

### P1-4 · Transformer le bloc marketing en multiplicateur d'urgence

`High` · `3 pts` · `scoring`

**Contexte**

Le bloc marketing ne décrit pas l'état du site mais un déclencheur : un pivot d'offre justifie une refonte même sur un site sain. Le compter en points dilue les deux signaux. Décision validée.

**Spécification**

- Sortir marketing de la pondération.
- Produire urgency: 'faible' | 'moyenne' | 'forte' à partir du pivot d'offre, du changement de branding et du besoin de nouvelles pages.
- L'urgence module le message et le CTA, jamais le chiffre du score.
- Cas à soigner : score faible mais urgence forte — « votre site est sain mais ne parle plus de votre offre actuelle ». C'est un excellent lead.

**Critères d'acceptation**

- [ ] Un pivot d'offre déclaré remonte urgency = forte, quel que soit le score.
- [ ] Le message de restitution combine bien score et urgence sur les 9 cas possibles.

**Fichiers concernés**

- `src/lib/scoring/`
- `src/data/questionquiz.json:123-193`

---
Réf. interne : `P1-4` · Dépendances : P1-2

### P1-5 · Recalibrer les réponses « Je ne sais pas »

`High` · `2 pts` · `scoring`

**Contexte**

« Je ne sais pas » vaut 3 sur 5. Ne pas savoir si son site est accessible signifie en pratique qu'il ne l'est pas, et surtout que personne ne pilote le sujet. Dans un score d'urgence, l'ignorance est un signal fort, pas un signal neutre.

**Spécification**

- Dans le sens urgence, « Je ne sais pas » doit valoir 4 sur 5, pas 3.
- Reformuler le libellé en non culpabilisant : « Je ne pilote pas ce point ».
- Concerne ux-2, ux-3, performance-1, legal-1, technique-1.
- Exploiter le signal en restitution : « 5 de vos réponses sont des “je ne sais pas” — c'est en soi un diagnostic ».

**Critères d'acceptation**

- [ ] Un questionnaire entièrement rempli avec « Je ne sais pas » produit un score d'urgence supérieur à 75.
- [ ] Le nombre de « je ne sais pas » est exposé dans le résultat.

**Fichiers concernés**

- `src/data/questionquiz.json`
- `src/lib/scoring/`

---
Réf. interne : `P1-5` · Dépendances : P1-1, P1-2

### P1-6 · Calibrer le score sans données historiques

`Urgent` · `5 pts` · `scoring` `data`

**Contexte**

Moins de 10 soumissions en un an : la calibration statistique sur l'historique est impossible. Il faut donc calibrer a priori, sur des cas réels choisis à la main. C'est plus long mais c'est la seule méthode disponible — et une calibration ratée est ce qui décide si l'outil convertit ou non.

**Spécification**

- Constituer un panel de 15 sites WordPress de PME parisiennes réelles, représentatifs de la cible.
- Répondre au quiz à la main pour chacun, en s'appuyant sur ce qui est observable.
- Ajouter 5 profils synthétiques bornes : site neuf impeccable, site abandonné depuis 8 ans, site correct mais daté, site technique bon et design mauvais, site design bon et technique mauvais.
- Cible : médiane du panel entre 55 et 65 sur l'échelle d'urgence, distribution étalée.
- Ajuster les poids jusqu'à ce que le classement obtenu corresponde à l'ordre dans lequel on prospecterait réellement ces 15 sites — c'est le vrai test.
- Figer le panel dans le repo comme jeu de tests de non-régression.

**Critères d'acceptation**

- [ ] Le panel de 20 cas est versionné et rejouable.
- [ ] La médiane est comprise entre 55 et 65.
- [ ] Le classement du score correspond à l'ordre de priorité commerciale du panel.

**Fichiers concernés**

- `src/lib/scoring/__fixtures__/`
- `scripts/calibrate.mjs`

---
Réf. interne : `P1-6` · Dépendances : P1-2, P1-5

### P1-7 · Versionner et persister le score structuré

`Urgent` · `3 pts` · `scoring` `backend`

**Contexte**

La Cloud Function envoie un TOTAL brut non normalisé à Brevo. Sans numéro de version, les leads d'aujourd'hui ne seront plus comparables à ceux d'après refonte du barème — et avec moins de 10 soumissions, chaque lead compte double.

**Spécification**

- Importer le moteur de scoring dans functions/ et recalculer côté serveur : ne jamais faire confiance au score envoyé par le client.
- Persister dans Firestore : scoreVersion, scoreGlobal (0-100), scores normalisés, urgency, alerts, nombre de « je ne sais pas ».
- Attributs Brevo : SCORE_GLOBAL, SCORE_VERSION, URGENCE, plus les scores normalisés par catégorie.
- Conserver les anciens attributs le temps de mettre le mail à jour (P3-7), puis les retirer.
- Ne pas migrer les 10 anciennes soumissions : elles restent en version 1.

**Critères d'acceptation**

- [ ] Un score envoyé par le client est ignoré et recalculé côté serveur.
- [ ] Chaque document porte un scoreVersion.
- [ ] Les segments Brevo filtrent sur SCORE_GLOBAL et URGENCE.

**Fichiers concernés**

- `functions/src/index.ts:106-125`
- `src/lib/scoring/`

---
Réf. interne : `P1-7` · Dépendances : P1-2

### P1-8 · Couvrir le moteur de score par des tests

`High` · `3 pts` · `test` `scoring`

**Contexte**

Le score est le cœur commercial du produit et il sera modifié à chaque phase. Le panel de calibration de P1-6 fournit déjà les cas les plus utiles.

**Spécification**

- Runner node:test, sans dépendance supplémentaire.
- Rejouer le panel de calibration comme test de non-régression.
- Cas : score plein, score nul, catégorie absente, question ajoutée sans changement de poids, déterminisme, somme des poids = 100.
- Un test par question vérifiant la direction du score.

**Critères d'acceptation**

- [ ] npm test passe.
- [ ] Modifier un poids sans incrémenter SCORE_VERSION fait échouer un test.
- [ ] Un décalage de médiane supérieur à 5 points sur le panel fait échouer un test.

**Fichiers concernés**

- `src/lib/scoring/`

---
Réf. interne : `P1-8` · Dépendances : P1-6

## Phase 2 — Acquisition

**Semaines 2-8, en parallèle** · 10 tickets · 39 points

**Objectif** — Résoudre le goulot le plus probable : personne n'arrive. Le SEO met 6 mois à produire, donc il démarre tout de suite et s'accompagne d'un canal à effet immédiat.

**Condition de sortie** — La page est indexée sur des requêtes atteignables, le site est propre sur mobile, et un canal de trafic non-SEO produit des soumissions dès le premier mois.

### P2-1 · Basculer l'outil en sous-dossier de thatmuch.fr

`Urgent` · `5 pts` · `seo` `architecture`

**Contexte**

L'outil est servi sur https://audit-refonte.thatmuch.fr/ (export statique Next sur GitHub Pages, aucun basePath). Le site principal thatmuch.fr est un headless Gatsby + WordPress chez Hostinger, statique en sortie. FAISABILITÉ VÉRIFIÉE sur le repo thatmuch : le déploiement Gatsby utilise appleboy/scp-action (source public/*, target /home/u566000124/domains/thatmuch.fr/public_html, strip_components 1) — c'est un SCP qui écrase et ajoute, sans jamais supprimer, et l'option rm n'est pas activée. Un sous-dossier audit-refonte/ survivra donc à chaque publication. Le .htaccess ne contient que des directives de cache, aucune réécriture. COLLISION ÉVITÉE : /refonte-site-web/ était le chemin initialement proposé, mais c'est déjà un article publié sur thatmuch.fr (« Refonte de site web : comment en 5 étapes »). Le déployer là l'aurait écrasé. Chemin retenu : /audit-refonte/, libre, et identique au nom du sous-domaine actuel — le 301 est donc une correspondance directe. Seul obstacle réel : gatsby-plugin-offline. Enjeu : le contenu à venir (P2-5, P2-8, landings) compose avec les articles refonte existants sur le domaine principal, au lieu de bâtir un second îlot plus faible. Moment le moins cher possible : trafic et positions quasi nuls.

**Spécification**

- Passer en sous-dossier ne fusionne pas les codebases : deux repos, deux builds, deux pipelines, npm run dev inchangé sur audit-refonte seul. Seuls le basePath et la cible de déploiement changent.
- 1. audit-refonte : ajouter basePath '/audit-refonte' dans next.config.ts.
- 2. audit-refonte : remplacer actions/deploy-pages par appleboy/scp-action dans le workflow, source out/*, target /home/u566000124/domains/thatmuch.fr/public_html/audit-refonte, strip_components 1, port 65002. Reporter les secrets HOSTINGER_IP, HOSTINGER_USER et HOSTINGER_SSH_KEY dans ce repo.
- 3. thatmuch : passer gatsby-plugin-offline en forme objet avec workboxConfig.navigateFallbackDenylist = [/^\/audit-refonte/]. Le service worker a un scope / et un navigateFallback vers l'app shell : sans cette exclusion, un visiteur déjà venu sur thatmuch.fr recevra l'app shell puis un 404 du routeur Gatsby. Le service worker intercepte toutes les navigations dans son scope, y compris un chargement complet depuis la barre d'URL — un <a href> ne suffit donc pas à contourner.
- 4. thatmuch : deploy.yml ne se déclenche que sur repository_dispatch [cms_update], sans push ni workflow_dispatch. Ajouter workflow_dispatch pour pouvoir redéployer à la main après le changement de config.
- 5. Les liens internes depuis les pages Gatsby doivent être des <a href> classiques, pas des <Link> Gatsby, qui seraient interceptés par le routeur client.
- 6. 301 de audit-refonte.thatmuch.fr vers la nouvelle URL, et mise à jour des liens internes existants pour pointer directement vers la destination plutôt que via la redirection.
- 7. Déclarer le sitemap de l'outil dans le robots.txt racine généré par gatsby-plugin-robots-txt : Gatsby ne connaît pas les pages du sous-dossier.
- Bonus : gatsby-plugin-google-tagmanager est déjà configuré sur thatmuch.fr. En sous-dossier, réutiliser le même conteneur GTM donne un funnel unifié dans un seul GA4, de l'article au lead — simplifie P0-4.
- Route écartée : reverse proxy Hostinger vers GitHub Pages — mod_proxy vers un hôte externe est généralement indisponible en mutualisé, et deux hostnames servant le même contenu créent du duplicate content.
- TIME-BOX : si ce n'est pas fonctionnel en une journée, revenir au sous-domaine et clore le sujet.
- Repli sous-domaine : renforcer le maillage avec des ancres variées sur les requêtes cibles, et ajouter un flux retour du sous-domaine vers thatmuch.fr.

**Critères d'acceptation**

- [ ] Une publication d'article sur thatmuch.fr ne supprime pas le sous-dossier de l'outil — vérifié après un déploiement réel.
- [ ] Un visiteur ayant déjà le service worker Gatsby installé atteint bien l'outil, sans 404.
- [ ] npm run dev sur audit-refonte fonctionne sans lancer Gatsby ni WordPress.
- [ ] L'ancienne URL redirige en 301 et une seule URL est indexable.
- [ ] Le sitemap de l'outil est déclaré dans le robots.txt racine.
- [ ] La décision finale est documentée dans docs/roadmap.md et le domaine est figé avant P2-2.

**Fichiers concernés**

- `next.config.ts`
- `.github/workflows/nextjs.yml`
- `../thatmuch/gatsby-config.js`
- `../thatmuch/.github/workflows/deploy.yml`

---
Réf. interne : `P2-1` · Dépendances : P0-5

### P2-2 · Cibler des requêtes atteignables plutôt que « refonte site web »

`Urgent` · `3 pts` · `seo` `contenu`

**Contexte**

« refonte site web » est une requête de tête, verrouillée par des agences installées et des annuaires à fort historique. Un sous-domaine neuf, sans contenu ni backlinks, ne la prendra pas — viser cette requête directement, c'est investir dans un objectif hors de portée à 12 mois. Les combinaisons métier + géographie sont atteignables et le lead y est bien meilleur, surtout avec un ancrage parisien et une spécialité WordPress.

**Spécification**

- Cibles prioritaires : refonte site wordpress paris, refonte site internet pme paris, refonte site vitrine paris, prix refonte site wordpress, refaire son site wordpress.
- Garder « refonte site web » comme objectif de long terme, atteint par accumulation, pas comme cible de la page d'accueil.
- Title : porter l'intention, la gratuité et la géographie.
- Conserver le H1 interrogatif existant, qui matche bien les requêtes en question.
- Ajouter un sous-titre portant : audit gratuit, refonte WordPress, Paris, 3 minutes, sans engagement.

**Critères d'acceptation**

- [ ] Le title contient une requête réellement atteignable et la géographie.
- [ ] La page indique au-dessus du pli ce qu'elle propose, à qui, et où.
- [ ] La liste des requêtes cibles est documentée et suivie dans Search Console.

**Fichiers concernés**

- `app/page.tsx:13-16`
- `src/components/LandingRefonte/Landing/HeroSection/`

---
Réf. interne : `P2-2` · Dépendances : P2-1

### P2-3 · Compléter les métadonnées : metadataBase, Open Graph, canonical

`Urgent` · `2 pts` · `seo` `tech-debt`

**Contexte**

Aucune balise Open Graph ni Twitter Card n'est déclarée : tout partage du lien s'affiche sans image ni description. metadataBase et canonical manquent aussi. Coût quasi nul, effet immédiat, et prérequis de tout partage.

**Spécification**

- Déclarer metadataBase dans app/layout.tsx.
- Open Graph et Twitter Card sur la page d'accueil et sur le tunnel, avec une image dédiée.
- Canonical sur chaque page.
- Corriger la faute dans app/layout.tsx:7 (« Découvres ») et supprimer la duplication de metadata avec app/page.tsx.

**Critères d'acceptation**

- [ ] Le partage du lien affiche titre, description et image.
- [ ] Chaque page déclare un canonical.
- [ ] Aucune metadata dupliquée entre layout et page.

**Fichiers concernés**

- `app/layout.tsx:5-8`
- `app/page.tsx:13-16`

---
Réf. interne : `P2-3` · Dépendances : P2-1

### P2-4 · Générer sitemap.xml et robots.txt au build

`High` · `1 pts` · `seo` `tech-debt`

**Contexte**

Ni sitemap ni robots.txt. En export statique, app/sitemap.ts et app/robots.ts fonctionnent et sont générés au build.

**Spécification**

- Créer app/sitemap.ts et app/robots.ts.
- Vérifier la présence des fichiers dans out/ après build.
- Soumettre le sitemap dans Search Console.

**Critères d'acceptation**

- [ ] out/sitemap.xml et out/robots.txt sont générés.
- [ ] Le sitemap est soumis et accepté dans Search Console.

**Fichiers concernés**

- `app/sitemap.ts`
- `app/robots.ts`

---
Réf. interne : `P2-4` · Dépendances : P2-1

### P2-5 · Ajouter du contenu indexable sous le pli

`Urgent` · `5 pts` · `seo` `contenu`

**Contexte**

La page d'accueil compte environ 150 mots répartis en 4 sections : elle ne se positionnera sur rien. Le piège « optimiser le SEO au détriment du message » se résout par l'ordre, pas par l'arbitrage : hero purement conversion au-dessus du pli, contenu SEO en dessous. Google le lit, et ça pré-qualifie commercialement — utile sur un panier de 2000-3000 EUR où le temps de qualification coûte cher.

**Spécification**

- 800 à 1500 mots en H2, sous les sections existantes.
- Sujets, alignés sur les requêtes de P2-2 : quand refondre un site WordPress, les 7 signaux qui doivent alerter, combien coûte une refonte WordPress pour une PME, refonte ou simple rafraîchissement, combien de temps ça prend.
- Donner un ordre de prix réel : c'est la requête la plus fréquente et la plus qualifiante, et l'éviter fait fuir.
- Répondre à la question dans les deux premières phrases de chaque section.
- Ne pas toucher au hero.

**Critères d'acceptation**

- [ ] La page dépasse 800 mots de contenu réel.
- [ ] Le hero et le CTA principal sont inchangés.
- [ ] Chaque H2 correspond à une requête de la liste cible.

**Fichiers concernés**

- `app/page.tsx`
- `src/components/LandingRefonte/Landing/`

---
Réf. interne : `P2-5` · Dépendances : P2-2

### P2-6 · Déclarer LocalBusiness et les données structurées

`High` · `3 pts` · `seo`

**Contexte**

Avec un ancrage parisien et une cible PME, LocalBusiness est la donnée structurée qui compte réellement. FAQPage n'affiche plus de rich results depuis les restrictions de 2023 mais reste utile aux réponses IA. Des avis clients réels existent : AggregateRating devient déclarable, ce qui est rare et précieux.

**Spécification**

- Organization et LocalBusiness avec l'adresse et la zone desservie (Paris / Île-de-France).
- WebApplication avec offers price 0 pour l'outil gratuit.
- FAQPage sur le contenu de P2-5.
- AggregateRating uniquement à partir des avis réellement collectés et vérifiables, jamais reconstitués.
- Valider avec l'outil de test des résultats enrichis de Google.

**Critères d'acceptation**

- [ ] Le test Google ne remonte aucune erreur.
- [ ] Chaque avis déclaré est traçable jusqu'à sa source.

**Fichiers concernés**

- `app/layout.tsx`
- `app/page.tsx`

---
Réf. interne : `P2-6` · Dépendances : P2-5

### P2-7 · Retirer Bootstrap et remettre le mobile en état

`Urgent` · `8 pts` · `perf` `tech-debt` `frontend`

**Contexte**

bootstrap.min.css est importé globalement (app/layout.tsx:1) avec Sass et GSAP par-dessus, sur un outil dont le métier est de noter la performance et le design des autres. Tailwind est déjà installé et inutilisé. Décision prise : retirer Bootstrap. C'est aussi la meilleure démonstration commerciale possible — un score public irréprochable sur son propre outil.

**Spécification**

- Migrer les composants vers Tailwind : container-fluid, row, col-md-*, form-control, form-group, btn, badge, d-flex, utilitaires d'espacement.
- Retirer bootstrap des dépendances une fois la migration terminée.
- Charger GSAP à la demande, uniquement sur les vues qui l'utilisent.
- Vérifier le poids et la priorité de chargement des images de planètes.
- Passer les images purement décoratives en alt vide : elles portent aujourd'hui des alt descriptifs que les lecteurs d'écran annoncent inutilement.
- Objectif : score performance mobile supérieur à 90 sur la page d'accueil et sur le tunnel.

**Critères d'acceptation**

- [ ] bootstrap n'apparaît plus dans package.json.
- [ ] Le score performance mobile dépasse 90 sur les deux pages.
- [ ] L'audit accessibilité ne remonte rien sur les images.
- [ ] Aucune régression visuelle sur mobile et desktop.

**Fichiers concernés**

- `app/layout.tsx:1-2`
- `src/components/`
- `package.json`

---
Réf. interne : `P2-7` · Dépendances : aucune

### P2-8 · Publier deux cas clients chiffrés

`High` · `5 pts` · `seo` `conversion` `contenu`

**Contexte**

Un cas client avant/après avec chiffres est simultanément le meilleur élément de conversion, une page qui se positionne sur « [secteur] + refonte », et une source de citations. Sur un panier de 2000-3000 EUR auprès de PME, la preuve que d'autres PME ont franchi le pas fait plus que n'importe quel argument technique.

**Spécification**

- Deux cas minimum, sur des PME idéalement parisiennes et sur WordPress.
- Structure : contexte, problème constaté, ce qui a été fait, résultat chiffré, durée, budget indicatif.
- Les chiffres en clair dans le texte, jamais dans une image : un résultat en visuel Canva est invisible pour Google et pour les lecteurs d'écran.
- Obtenir l'accord écrit du client sur les chiffres publiés.
- Lier chaque cas au quiz : « ce client aurait obtenu 78/100 avant la refonte ».

**Critères d'acceptation**

- [ ] Deux cas sont publiés avec des chiffres vérifiables et l'accord du client.
- [ ] Aucun chiffre n'est enfermé dans une image.

**Fichiers concernés**

- `app/cas-clients/`

---
Réf. interne : `P2-8` · Dépendances : P2-5

### P2-9 · Ouvrir un canal de trafic à effet immédiat

`Urgent` · `5 pts` · `acquisition`

**Contexte**

Le SEO met 4 à 6 mois à produire ses premiers résultats. Avec moins de 10 soumissions en un an, attendre le SEO signifie une année de plus sans lead. Il faut un canal qui produit dès le premier mois, pendant que le SEO s'amorce. Sur une cible PME parisienne et un panier de 2000-3000 EUR, la prospection outillée est le canal le plus court.

**Spécification**

- Utiliser l'outil comme prétexte de prospection : analyser à la main 20 sites WordPress de PME parisiennes et envoyer à chacune un résultat personnalisé.
- Mesurer le taux de réponse : c'est aussi le meilleur test de la pertinence du score avant de l'automatiser.
- En parallèle : publier les constats agrégés du panel de calibration (P1-6) sur LinkedIn — du contenu original et chiffré sur les sites de PME parisiennes.
- Suivre les soumissions par source via les paramètres UTM et l'instrumentation de P0-4.
- Ce ticket conditionne la Phase 4 : si la prospection sortante fonctionne, l'analyse automatique devient prioritaire pour la passer à l'échelle.

**Critères d'acceptation**

- [ ] 20 analyses manuelles envoyées et le taux de réponse mesuré.
- [ ] Les soumissions sont attribuables à leur source.
- [ ] La décision de prioriser ou non la Phase 4 est prise sur ces résultats.

**Fichiers concernés**

- `docs/roadmap.md`

---
Réf. interne : `P2-9` · Dépendances : P1-6, P0-4

### P2-10 · Brancher NumbersSection sur des chiffres réels ou la retirer

`Medium` · `2 pts` · `seo` `conversion`

**Contexte**

La section de chiffres existe. Avec moins de 10 soumissions, un compteur « X sites analysés » se retourne contre l'outil. Soit on affiche autre chose de vrai, soit on n'affiche rien — mais on n'invente pas.

**Spécification**

- Ne pas afficher le nombre de soumissions tant qu'il n'est pas présentable.
- Alternative honnête : chiffres du panel de calibration (P1-6), ou chiffres de l'agence (années d'expérience, sites livrés).
- Aucune valeur écrite en dur qui ne corresponde à une réalité vérifiable.
- Rebrancher sur le compteur réel une fois le seuil atteint.

**Critères d'acceptation**

- [ ] Chaque chiffre affiché correspond à une réalité vérifiable.
- [ ] Aucun compteur de soumissions n'est affiché sous le seuil défini.

**Fichiers concernés**

- `src/components/LandingRefonte/Landing/NumbersSection/NumbersSection.tsx`

---
Réf. interne : `P2-10` · Dépendances : aucune

## Phase 3 — Restitution et conversion

**Semaines 6-8** · 6 tickets · 21 points

**Objectif** — Afficher une partie du score sur le site, garder le gate email, et mettre un chemin vers la prise de RDV à chaque point de sortie.

**Condition de sortie** — Le visiteur voit son niveau d’urgence sans donner son email, et le taux de passage vers la prise de RDV est mesuré.

### P3-1 · Persister l'état du quiz entre les rechargements

`High` · `2 pts` · `ux` `frontend`

**Contexte**

useScoreStore n'a aucune persistance. Un rafraîchissement ou un retour arrière au milieu du quiz efface toutes les réponses. Sur un tunnel de 21 questions à dominante mobile et avec moins de 10 soumissions par an, chaque abandon évitable compte.

**Spécification**

- Ajouter le middleware persist de Zustand sur sessionStorage.
- Persister aussi l'index de catégorie courant, aujourd'hui en useState local.
- Purger le store après soumission réussie.
- Corriger RefonteFormClient.tsx:19 : new Set(data.map(q => q)) est un Set d'objets et ne déduplique rien.

**Critères d'acceptation**

- [ ] Recharger la page au milieu du quiz restaure les réponses et l'étape.
- [ ] Après soumission, un nouveau visiteur repart d'un état vierge.

**Fichiers concernés**

- `src/store/useScoreStore.ts`
- `app/refonte-form/RefonteFormClient.tsx:13-32`

---
Réf. interne : `P3-1` · Dépendances : aucune

### P3-2 · Afficher une partie du score avant le gate email

`Urgent` · `5 pts` · `conversion` `frontend`

**Contexte**

Le quiz se termine directement sur le formulaire de contact : 100% de la valeur est gatée, au moment exact du pic de curiosité. Décision retenue : garder le gate email pour pouvoir recontacter, mais montrer une partie du résultat. Le formulaire devient l'accès au détail, pas l'accès au résultat.

**Spécification**

- Écran de résultat intercalé entre la fin du quiz et ContactForm.
- Affiché librement : le niveau d'urgence global, les alertes RGPD, et UN axe faible nommé.
- Gaté derrière l'email : le détail par catégorie, les recommandations priorisées, et le comparatif.
- Annoncer explicitement ce qui est derrière le gate — un flou sans promesse ne convertit pas.
- Mesurer result_viewed puis contact_form_viewed pour isoler l'effet du changement.

**Critères d'acceptation**

- [ ] Le visiteur voit son niveau d'urgence sans donner d'email.
- [ ] Le taux de passage résultat vers soumission est mesurable.
- [ ] Le contenu gaté est décrit précisément avant la saisie.

**Fichiers concernés**

- `app/refonte-form/RefonteFormClient.tsx:49-65`
- `src/components/LandingRefonte/`

---
Réf. interne : `P3-2` · Dépendances : P1-2, P0-4

### P3-3 · Contextualiser le score sans base de comparaison

`High` · `3 pts` · `conversion` `frontend`

**Contexte**

Un score nu est inutile : « 42/100, et alors ? ». Le réflexe serait d'afficher « mieux que X% des sites analysés » — impossible ici, moins de 10 soumissions ne permettent aucun rang crédible. Il faut donc contextualiser autrement, sans mentir.

**Spécification**

- Ne pas afficher de rang tant que la base n'atteint pas 50 soumissions réelles.
- Contextualiser par le gain : « les 3 points ci-dessous représentent 18 points d'urgence ; traités, vous descendez à 34 ».
- Calculer le gain en rejouant le moteur avec les critères concernés au mieux, jamais en dur.
- Contextualiser par le seuil qualitatif : à quoi ressemble concrètement un site à 70 d'urgence.
- Prévoir l'activation du rang une fois le seuil atteint.

**Critères d'acceptation**

- [ ] Aucun rang comparatif n'est affiché sous 50 soumissions.
- [ ] Le score projeté est reproductible via le moteur.
- [ ] Le seuil d'activation du rang est implémenté et documenté.

**Fichiers concernés**

- `src/lib/scoring/`
- `src/components/LandingRefonte/`

---
Réf. interne : `P3-3` · Dépendances : P3-2

### P3-4 · Différencier le CTA par palier d'urgence

`Urgent` · `3 pts` · `conversion`

**Contexte**

Le score choisit quel CTA afficher, pas s'il y en a un. Sur une échelle d'urgence, les paliers s'inversent par rapport à la version précédente : c'est le score élevé qui appelle la refonte.

**Spécification**

- Urgence supérieure à 65 : « Faire relire mon diagnostic par un designer, 30 min » vers le lien HubSpot Meetings.
- Urgence entre 35 et 65 : cœur de cible. Même CTA, message centré sur l'axe le plus faible.
- Urgence inférieure à 35 : ne pas forcer la refonte. Proposer une optimisation ciblée ou du contenu, et le dire honnêtement — c'est ce qui fait revenir et recommander.
- L'urgence issue de P1-4 module le message : score faible mais urgence forte donne « votre site est sain mais ne parle plus de votre offre actuelle ».

**Critères d'acceptation**

- [ ] Les trois paliers rendent trois CTA distincts.
- [ ] Un score inférieur à 35 ne pousse jamais une refonte complète.
- [ ] Les 9 combinaisons score x urgence produisent un message cohérent.

**Fichiers concernés**

- `src/components/LandingRefonte/`

---
Réf. interne : `P3-4` · Dépendances : P3-2, P1-4, P0-6

### P3-5 · Ajouter les badges de source et le panneau de méthode

`Medium` · `3 pts` · `conversion` `frontend` `architecture`

**Contexte**

Le mélange non signalé entre déclarations et mesures est ce qui rend un score contestable. Dire d'où vient chaque point est plus persuasif que le score lui-même. C'est aussi l'infrastructure d'affichage dont les Phases 4 et 5 auront besoin.

**Spécification**

- Chaque constat porte une source : 'mesure', 'evaluation' ou 'declaration'.
- Trois traitements visuels distincts, avec légende.
- Panneau dépliable « comment ce score est calculé » : axes évalués, sources, principe de normalisation.
- Transparent sur la méthode, opaque sur les coefficients — publier les poids invite à discuter la formule au lieu du problème.
- À ce stade tous les constats sont en 'declaration' : le composant est prêt pour la suite.

**Critères d'acceptation**

- [ ] Ajouter un constat mesuré en Phase 4 ne demande aucune modification du composant.
- [ ] Le panneau ne contient aucun coefficient chiffré.
- [ ] La version du barème affichée correspond à SCORE_VERSION.

**Fichiers concernés**

- `src/lib/scoring/`
- `src/components/LandingRefonte/`

---
Réf. interne : `P3-5` · Dépendances : P3-2

### P3-6 · Refondre le template de mail sur le nouveau modèle

`Urgent` · `5 pts` · `email` `conversion`

**Contexte**

Le mail est le produit réellement livré : c'est lui qui porte le détail gaté. Après P1-2 et P1-7, ses variables changent (scores normalisés, urgence, alertes) et ses seuils 33/66 ne correspondent plus à rien. P0-1 et P0-2 sont des correctifs d'urgence ; ce ticket est la refonte de fond.

**Spécification**

- Basculer sur les nouveaux attributs Brevo : SCORE_GLOBAL sur 100, URGENCE, scores normalisés par catégorie.
- Recalculer les seuils de branche sur l'échelle d'urgence.
- Ajouter le bloc d'alertes RGPD, distinct du score.
- Structurer sur le modèle : l’axe le plus faible en premier, nommé et expliqué, puis le détail, puis le CTA de prise de RDV.
- Retirer la formulation « Ce score est une indication basée sur vos réponses » ou la déplacer en bas de page.
- Vérifier le rendu mobile — la majorité des ouvertures se fait sur mobile.

**Critères d'acceptation**

- [ ] Le mail n'utilise plus aucun attribut Brevo obsolète.
- [ ] Les trois branches sont testées avec des contacts de test couvrant les paliers.
- [ ] Le rendu mobile est vérifié sur au moins deux clients mail.

**Fichiers concernés**

- `codeEmailBrevo.html`

---
Réf. interne : `P3-6` · Dépendances : P1-7, P3-4

## Phase 4 — Analyse automatique HTML

**Semaines 9-11** · 8 tickets · 33 points

**Objectif** — Passer du déclaratif au mesuré sur les constats factuels, à coût quasi nul, et débloquer l'usage de l'outil en prospection sortante.

**Condition de sortie** — Une analyse HTML tourne en moins de 3s, résiste au SSRF, est cachée par domaine, et peut être lancée en lot sur une liste de prospects.

### P4-1 · Déplacer le champ URL en tête de tunnel

`High` · `3 pts` · `analyse-auto` `ux`

**Contexte**

L'URL est demandée dans le formulaire final. Toute analyse automatique n'aurait donc que quelques secondes pour tourner, au pire moment. En la demandant en premier, l'analyse dispose des 3 minutes du quiz et le quiz devient l'écran de chargement.

**Spécification**

- Écran d'entrée avec un seul champ URL, avant la première question.
- Normaliser l'entrée (schéma, chemin, casse) et valider le format.
- Stocker l'URL dans le store et la pré-remplir en lecture seule dans ContactForm.
- Permettre de continuer sans URL : le quiz reste utilisable en mode déclaratif.
- Surveiller l'effet sur l'abandon : un champ URL en première position peut faire fuir. Comparer avant/après via P0-4.

**Critères d'acceptation**

- [ ] Saisir « monsite.fr » produit une URL valide.
- [ ] L'URL saisie se retrouve dans la soumission sans re-saisie.
- [ ] Refuser de donner une URL n'empêche pas de finir le quiz.
- [ ] L'effet sur le taux d'abandon à l'étape 1 est mesuré.

**Fichiers concernés**

- `app/refonte-form/RefonteFormClient.tsx`
- `src/components/LandingRefonte/ContactForm/ContactForm.tsx:78-87`

---
Réf. interne : `P4-1` · Dépendances : P0-4

### P4-2 · Durcir analyzeUrl contre le SSRF et l'abus

`Urgent` · `5 pts` · `securite` `backend`

**Contexte**

Un endpoint public qui va chercher une URL fournie par l'utilisateur, exposé depuis un site statique, est un SSRF livré clé en main et une facture Cloud Functions ouverte à qui veut. Avec un budget de 10 EUR par mois, une facture qui dérape n'est pas une hypothèse abstraite. À traiter avant la mise en ligne de P4-3.

**Spécification**

- Activer Firebase App Check sur la fonction.
- Rate limit par IP et par domaine analysé, compteur en Firestore.
- Refuser les IP privées, loopback, link-local, et notamment 169.254.169.254 — résoudre le DNS et vérifier l'IP, pas seulement la chaîne.
- Limiter les redirections à 3 et revalider l'IP à chaque saut.
- Timeout de 10 secondes, réponse plafonnée à 5 Mo, content-type restreint au HTML.
- N'accepter que http et https.
- Configurer une alerte de facturation Google Cloud à 10 EUR.

**Critères d'acceptation**

- [ ] Une URL vers 127.0.0.1, 169.254.169.254 ou une plage privée est refusée.
- [ ] Une redirection vers une IP privée est refusée au saut concerné.
- [ ] Le rate limit se déclenche et est testé.
- [ ] L'alerte de facturation est active.

**Fichiers concernés**

- `functions/src/analyze/`
- `firestore.rules`

---
Réf. interne : `P4-2` · Dépendances : aucune

### P4-3 · Cloud Function analyzeUrl — fetch et parsing HTML

`High` · `8 pts` · `analyse-auto` `backend`

**Contexte**

Étage factuel : coût quasi nul, latence de 1 à 3 secondes, faux positifs quasi nuls parce que les constats sont binaires et vérifiables. Le site étant en export statique, tout passe par Firebase Functions. À volume actuel, le coût reste dans l'offre gratuite du plan Blaze.

**Spécification**

- Fonction HTTP analyzeUrl dans functions/, parsing avec linkedom ou cheerio.
- Détecter : h1 présent et unique, hiérarchie Hn, title, meta description, meta viewport, images sans alt, formats d'images, HTTPS et HSTS, sitemap.xml, robots.txt, JSON-LD, Open Graph, CMS (meta generator, wp-content, patterns Wix/Shopify), version WordPress et thème si exposés, bandeau cookies, liens mentions légales et politique de confidentialité, année du copyright, volume de contenu.
- La détection WordPress est prioritaire : c'est la cible commerciale, et un thème daté ou un empilement d'extensions est l'argument de refonte le plus direct.
- Retourner des constats typés avec source 'mesure', jamais de prose libre.
- En cas de doute sur un critère, retourner 'indéterminé' plutôt qu'un constat négatif.

**Critères d'acceptation**

- [ ] L'analyse des 15 sites du panel de calibration retourne des constats exacts, vérifiés à la main.
- [ ] Un critère non déterminable remonte 'indéterminé' et n'entre pas dans le score.
- [ ] La fonction répond en moins de 3 secondes sur un site standard.

**Fichiers concernés**

- `functions/src/analyze/`

---
Réf. interne : `P4-3` · Dépendances : P4-2

### P4-4 · Détecter les sites rendus en JS et éviter les faux constats

`Urgent` · `3 pts` · `analyse-auto` `backend` `fiabilite`

**Contexte**

Les sites Wix et les SPA renvoient un DOM quasi vide au fetch HTTP. Sans détection, l'outil annoncerait « aucun contenu, aucun h1 » à des sites corrects. C'est exactement le faux positif factuel qui détruit la crédibilité — et Wix est fréquent chez les PME, donc dans la cible.

**Spécification**

- Heuristique : peu de texte hors script, conteneurs racine connus (#root, #__next, #app), noyau JS volumineux.
- En cas de détection, marquer les constats structurels 'indéterminé' et ne pas les scorer.
- Indiquer explicitement dans le rapport quels critères n'ont pas pu être évalués.
- Basculer ces critères sur Lighthouse en Phase 5, qui exécute le JS.

**Critères d'acceptation**

- [ ] Un site Wix ne remonte aucun constat négatif sur le contenu ou la structure.
- [ ] Le rapport liste les critères non évalués.

**Fichiers concernés**

- `functions/src/analyze/`

---
Réf. interne : `P4-4` · Dépendances : P4-3

### P4-5 · Cacher les analyses par domaine avec TTL

`High` · `3 pts` · `analyse-auto` `backend` `cout`

**Contexte**

Le cache résout le coût des re-tests, la latence perçue sur les domaines déjà vus, et une partie de l'abus. C'est le prérequis pour que les Phases 5 et 6 restent dans un budget de 10 EUR par mois.

**Spécification**

- Collection Firestore analyses, clé = domaine normalisé + version du pipeline.
- TTL de 7 jours pour les données volatiles, 30 jours pour le HTML structurel.
- Paramètre force réservé à un usage interne authentifié.
- Purge automatique via une politique TTL Firestore.

**Critères d'acceptation**

- [ ] Deux analyses successives du même domaine ne déclenchent qu'un seul fetch.
- [ ] Le cache expire au TTL configuré.

**Fichiers concernés**

- `functions/src/analyze/`
- `firestore.rules`

---
Réf. interne : `P4-5` · Dépendances : P4-3

### P4-6 · Injecter les constats mesurés dans le moteur de score

`High` · `5 pts` · `analyse-auto` `scoring`

**Contexte**

Sans cette étape, l'analyse automatique est un rapport à côté du score, pas un score. C'est le raccordement qui donne son sens à P1-2.

**Spécification**

- Chaque constat mesuré alimente une catégorie avec source 'mesure'.
- Quand mesure et déclaration se contredisent, la mesure gagne et la contradiction est affichée : c'est un argument de vente.
- Un critère 'indéterminé' n'entre pas au score et ne pénalise pas : le max théorique de la catégorie est recalculé.
- Rejouer la calibration sur le panel après raccordement : l'ajout de mesures déplace la distribution.

**Critères d'acceptation**

- [ ] Un critère indéterminé ne fait pas monter le score d'urgence.
- [ ] Une contradiction mesure/déclaration est visible dans le rapport.
- [ ] La médiane du panel reste dans la cible après recalibrage.

**Fichiers concernés**

- `src/lib/scoring/`
- `functions/src/analyze/`

---
Réf. interne : `P4-6` · Dépendances : P4-3, P1-6

### P4-7 · Mode lot pour la prospection sortante

`High` · `3 pts` · `analyse-auto` `acquisition`

**Contexte**

Si P2-9 confirme que la prospection outillée fonctionne, l'analyse automatique change de rôle : elle ne sert plus seulement les visiteurs entrants mais permet de préparer 50 approches personnalisées en une heure. C'est ce qui rentabilise la Phase 4 bien avant que le trafic entrant ne le fasse.

**Spécification**

- Script interne prenant une liste d'URLs et produisant un rapport par site.
- Authentifié, hors endpoint public, non soumis au rate limit visiteur.
- Sortie exploitable directement en prospection : axe le plus faible, constat chiffré, accroche suggérée.
- Respecter les robots.txt et un délai entre requêtes : on analyse des sites de prospects, pas des cibles.

**Critères d'acceptation**

- [ ] Une liste de 50 URLs produit 50 rapports sans intervention.
- [ ] Le script n'est pas accessible publiquement.
- [ ] Le délai entre requêtes est respecté.

**Fichiers concernés**

- `scripts/batch-analyze.mjs`

---
Réf. interne : `P4-7` · Dépendances : P4-3, P2-9

### P4-8 · Raconter l'analyse en cours pendant le quiz

`Medium` · `3 pts` · `analyse-auto` `ux`

**Contexte**

La latence perçue compte plus que la latence réelle. 45 secondes passent très bien si l'écran raconte ce qui se passe. C'est aussi une démonstration de sérieux pendant que le prospect répond.

**Spécification**

- Bandeau discret pendant le quiz : « analyse de monsite.fr en cours », puis les étapes franchies.
- Souscrire aux résultats via onSnapshot Firestore, le SDK client est déjà présent.
- En cas d'échec, dégrader silencieusement vers le mode déclaratif : ne jamais bloquer le quiz.

**Critères d'acceptation**

- [ ] Un échec d'analyse n'empêche jamais de terminer le quiz.
- [ ] L'avancement s'affiche sans polling.

**Fichiers concernés**

- `app/refonte-form/RefonteFormClient.tsx`
- `src/utils/firebase.ts`

---
Réf. interne : `P4-8` · Dépendances : P4-1, P4-3

## Phase 5 — PageSpeed

**Semaines 12-13** · 3 tickets · 10 points

**Objectif** — Ajouter la couche de crédibilité mesurée, traduite en langage métier, sans qu'elle domine l'analyse.

**Condition de sortie** — LCP, INP et CLS sont affichés en langage métier avec les seuils Google, et la performance reste sous 20% du score.

### P5-1 · Intégrer l'API PageSpeed Insights

`Medium` · `5 pts` · `pagespeed` `backend`

**Contexte**

Gratuit jusqu'à 25 000 requêtes par jour avec clé, et fournit performance, accessibilité via axe-core et SEO technique sans écrire une règle. Compatible avec un budget de 10 EUR par mois. Mobile en priorité : c'est ce que Google indexe et c'est le score le plus mauvais, donc le plus vendeur.

**Spécification**

- Appel depuis la Cloud Function uniquement : la clé ne doit jamais atteindre le navigateur, le site étant statique.
- Stratégie mobile obligatoire, desktop optionnel.
- Extraire LCP, INP, CLS, scores performance, accessibilité et SEO, et les audits à plus fort impact.
- Gérer les timeouts — l'API dépasse régulièrement 30 secondes — sans casser le pipeline.
- Stocker la clé via defineSecret, comme BREVO_API_KEY.
- Réutiliser le cache de P4-5.

**Critères d'acceptation**

- [ ] La clé n'apparaît dans aucun bundle client.
- [ ] Un timeout PSI dégrade proprement : le reste de l'analyse est rendu.

**Fichiers concernés**

- `functions/src/analyze/pagespeed.ts`
- `.env.example`

---
Réf. interne : `P5-1` · Dépendances : P4-3, P4-5

### P5-2 · Traduire LCP, INP et CLS en langage métier

`Medium` · `3 pts` · `pagespeed` `conversion`

**Contexte**

Un dirigeant de PME ne sait pas ce qu'est un score PageSpeed et les scores Lighthouse bruts n'ont aucun pouvoir de conviction. Ce qui convainc, c'est la métrique traduite et comparée à un seuil qui n'est pas le nôtre.

**Spécification**

- LCP : « temps avant que le visiteur voie votre offre », seuils 2,5s et 4s.
- INP : « réactivité au clic », seuils 200ms et 500ms.
- CLS : « est-ce que la page bouge sous le doigt », seuils 0,1 et 0,25.
- Comparer aux seuils Google et le dire : autorité empruntée, coût nul, risque nul.
- Ne pas afficher les 4 scores Lighthouse bruts.
- Ne jamais écrire « X% plus lent que vos concurrents » tant qu'aucun concurrent n'a été mesuré.
- Exploiter loadingExperience (données terrain CrUX) quand il existe ; ne rien dire quand il manque, plutôt que de signaler un trafic insuffisant.

**Critères d'acceptation**

- [ ] Aucun terme technique non traduit n'est visible sans dépliage.
- [ ] Chaque seuil est attribué à Google.
- [ ] Aucune comparaison concurrentielle non mesurée n'est affichée.
- [ ] L'origine de chaque chiffre, labo ou terrain, est indiquée.

**Fichiers concernés**

- `src/lib/scoring/`
- `src/components/LandingRefonte/`

---
Réf. interne : `P5-2` · Dépendances : P5-1, P3-5

### P5-3 · Borner la performance sous 20% du score

`Medium` · `2 pts` · `pagespeed` `scoring`

**Contexte**

PageSpeed est séduisant parce qu'objectif, donc la tentation est d'en faire le cœur du score. Mais la lenteur ne justifie pas une refonte, elle justifie une optimisation : le prospect à qui on dit « votre LCP est à 4s » appelle un freelance à 800 EUR, pas une agence à 2500 EUR. La performance achète la crédibilité, elle ne porte pas l'argument — surtout quand ce qui est vendu est du design.

**Spécification**

- Vérifier après P4-6 et P5-1 que le poids effectif de la performance reste sous 20%.
- Inscrire le pont dans les textes : la lenteur est le symptôme, la cause est structurelle — thème surchargé, empilement d'extensions, architecture datée — et ne se corrige pas par un patch.
- Rejouer la calibration sur le panel.

**Critères d'acceptation**

- [ ] Le poids effectif de la performance est mesuré et documenté.
- [ ] Aucun CTA de refonte ne repose uniquement sur un constat de performance.

**Fichiers concernés**

- `src/lib/scoring/`
- `scripts/calibrate.mjs`

---
Réf. interne : `P5-3` · Dépendances : P5-1, P4-6

## Phase 6 — Analyse visuelle IA (conditionnée)

**Non planifiée** · 1 tickets · 1 points

**Objectif** — Différenciateur réel, mais sans objet tant que le volume ne le justifie pas. Ne pas démarrer avant d'avoir atteint le seuil de déclenchement.

**Condition de sortie** — Seuil de déclenchement : 30 soumissions par mois pendant 2 mois consécutifs, ou usage confirmé en prospection sortante sur plus de 50 sites par mois.

### P6-1 · Décision de démarrage de l'analyse visuelle IA

`Low` · `1 pts` · `analyse-visuelle` `ia`

**Contexte**

L'analyse visuelle par LLM est le seul étage qui parle réellement de refonte design — Lighthouse ne dira jamais « ce site fait 2014 » — et c'est le différenciateur le plus aligné avec ce qui est vendu. Mais à moins de 10 soumissions par an, c'est optimiser une machine sans entrée. Ce ticket existe pour prendre la décision au bon moment, pas pour la reporter indéfiniment.

**Spécification**

- Seuil de déclenchement : 30 soumissions par mois pendant 2 mois consécutifs, OU usage confirmé en prospection sortante sur plus de 50 sites par mois via P4-7.
- Réévaluer à date fixe, une fois par mois, à partir des données de P0-4.
- Estimation à l'ouverture : environ 20 points (capture, évaluation sur rubrique fermée, déterminisme, plafond de coût).
- Coût unitaire estimé : 0,02 à 0,05 EUR par analyse, plus la capture d'écran. À volume atteint, tient dans le budget de 10 EUR par mois avec Playwright sur Cloud Run — un service de capture tiers démarre à 17 EUR par mois et sort du budget.
- Contraintes à respecter dès l'ouverture : le LLM produit des catégories ordinales, jamais des nombres ; chaque défaut cite un élément visible ; plafond de dépense et coupe-circuit avant mise en ligne.

**Critères d'acceptation**

- [ ] Le seuil est réévalué chaque mois et la décision est tracée.
- [ ] La phase n'est pas ouverte tant que le seuil n'est pas atteint.

**Fichiers concernés**

- `docs/roadmap.md`

---
Réf. interne : `P6-1` · Dépendances : P2-9, P4-7
