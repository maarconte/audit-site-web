# Leçons techniques

Constats issus de problèmes réellement rencontrés sur ce dépôt, conservés pour le
*pourquoi* : chacun explique une décision encore visible dans le code, et que rien
d'autre ne justifierait.

Récupérés du dossier `.jules/`, supprimé après l'arrêt des agents automatiques en
août 2026.

---

## `metadataBase` ignore le `basePath` par défaut

**17/08/2026 · `app/layout.tsx`, `app/opengraph-image.tsx`**

**Le piège.** `metadataBase: new URL("https://thatmuch.fr")`, avec des chemins
relatifs (`canonical: "/"`, `openGraph.url: "/"`) semblait la déclaration
naturelle. Le build passe, aucune erreur — mais le HTML généré donne
`https://thatmuch.fr/`, sans `/audit-refonte`. Next résout les URLs relatives
contre `metadataBase` seul ; il **n'y ajoute jamais le `basePath`**, contrairement
à `next/link` ou `next/image`, qui le préfixent automatiquement.

**Conséquence si ça passe inaperçu.** Un `canonical` faux dit à Google que cette
page est un doublon de la vraie page d'accueil (`thatmuch.fr/`, le site Gatsby) —
au mieux ignoré, au pire elle disparaît de l'index à son profit. Et `og:image`
pointe vers une image qui n'existe nulle part : partage cassé sur tous les
réseaux, silencieusement, aucune erreur ne le signale.

**La règle appliquée.** Inclure le `basePath` directement dans `metadataBase` :
`new URL("https://thatmuch.fr/audit-refonte/")`. Vérifier après coup dans le HTML
généré (`out/*.html`), jamais sur la seule lecture du code — c'est un défaut qui
ne casse ni le build ni les tests, uniquement le HTML produit.

## Les routes `opengraph-image.tsx` n'ont pas d'extension

**17/08/2026 · `public/.htaccess`**

**Le piège.** La convention Next `opengraph-image.tsx` produit, en export
statique, un fichier littéralement nommé `opengraph-image` — sans `.png`. Sur un
serveur Node, Next fixe l'en-tête `Content-Type` lui-même à la volée. Sur un
hébergement statique comme celui-ci, c'est Apache qui sert le fichier, et il n'a
que le nom pour deviner le type : sans extension, il tombe sur `text/plain` ou
`application/octet-stream`.

**Conséquence.** Les crawlers de partage (Facebook en tête) vérifient
strictement ce `Content-Type` et ignorent l'image si elle n'est pas déclarée en
`image/*` — le lien se partage sans miniature, sans erreur visible côté outil.

**La règle appliquée.** Forcer le type dans `.htaccess` :

```apache
<Files "opengraph-image">
  ForceType image/png
</Files>
```

---

## Mass assignment et IDOR par déstructuration d'objet

**03/03/2025 · `functions/src/index.ts`**

**La faille.** La Cloud Function acceptait des champs arbitraires du client — dont
`listIds` — et les transmettait tels quels à Brevo. C'est un cas d'école de *mass
assignment* : n'importe qui pouvait s'inscrire à une liste de diffusion privilégiée
ou masquée. Les variables d'entrée n'avaient par ailleurs ni contrôle de type ni
borne de longueur.

**Ce qu'il faut retenir.** Même avec des règles correctement écrites dans
`firestore.rules`, **le SDK admin s'exécute avec des privilèges élevés et les
contourne entièrement**. Déstructurer une entrée client pour la passer à une API
externe est dangereux par construction.

**La règle appliquée.** Contrôler strictement le type et les bornes de chaque valeur
déstructurée (`typeof email === "string" && email.length < 255`), et **exclure du
payload attendu tout champ non contrôlable par l'utilisateur** — listes cibles,
niveaux de permission — en les codant en dur côté serveur.

C'est ce que font aujourd'hui les commentaires `🛡️ SECURITY` de
`functions/src/index.ts` : `listIds` est ignoré, et le choix de liste se réduit à un
basculement booléen entre deux constantes.

---

## Le SCP de déploiement échoue par intermittence

**17/08/2026 · `.github/workflows/nextjs.yml`**

**Le problème.** La mise en production de la Phase 0 a échoué à l'étape
`Deploy via SSH (Hostinger)` : `dial tcp ***:65002: i/o timeout`. Le build avait
réussi, seul le transfert échouait. Le déploiement précédent, quatre jours plus tôt,
était passé sans rien changer entre-temps au workflow ni à l'hébergement.

**Ce qui a permis de trancher.** Depuis le poste : `nc 72.62.214.97 65002` répond
`SSH-2.0-OpenSSH_9.9`, et l'API Hostinger confirme l'`order` actif sur le bon
`root_directory`. Le serveur écoute, l'IP est la bonne, le compte est actif —
**seul le runner GitHub n'arrivait pas à établir la connexion TCP**.

**La règle appliquée.** Devant un `i/o timeout` sur cette étape, **relancer le job
avant de toucher à quoi que ce soit** :

```
gh run rerun <run-id> --failed
```

Le rerun est passé sans la moindre modification. Les runners GitHub changent d'IP
d'une exécution à l'autre et Hostinger en bloque une partie ; l'échec n'est ni le
workflow, ni les secrets, ni le serveur. Modifier `HOSTINGER_IP` ou le workflow en
réaction à ce symptôme, c'est corriger ce qui n'est pas cassé — et perdre la trace
du vrai motif.

**Le corollaire à ne pas oublier.** Le SCP écrase et ajoute, ne supprime jamais : un
rerun est sans danger, il redépose le même export. Vérifier ensuite que la home de
`thatmuch.fr` répond toujours 200 — le `target` doit rester le sous-dossier
`audit-refonte`, le viser trop haut écraserait le site principal.

---

## Boucle d'animation canvas laissée tourner à vide

**28/02/2025 · `src/components/ClickSpark/ClickSpark.tsx`**

**Le problème.** Démarrer une boucle `requestAnimationFrame` au montage du composant
et la laisser tourner en permanence — même sans rien à dessiner — consomme
massivement CPU et batterie. Next.js n'optimise pas ça.

**La règle appliquée.** Démarrer l'animation sur interaction (`onClick`), et
**l'arrêter explicitement** (`cancelAnimationFrame`, ou sortie de la récursion) dès
qu'il n'y a plus rien à rendre.
