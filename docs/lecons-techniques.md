# Leçons techniques

Constats issus de problèmes réellement rencontrés sur ce dépôt, conservés pour le
*pourquoi* : chacun explique une décision encore visible dans le code, et que rien
d'autre ne justifierait.

Récupérés du dossier `.jules/`, supprimé après l'arrêt des agents automatiques en
août 2026.

---

## `metadataBase` et le `basePath` : deux mécanismes incohérents entre eux

**17/08/2026 · `app/layout.tsx`, `src/lib/site.ts`**

**Premier piège.** `metadataBase: new URL("https://thatmuch.fr")`, avec des
chemins relatifs (`canonical: "/"`, `openGraph.url: "/"`) semblait la
déclaration naturelle. Le build passe, aucune erreur — mais le HTML généré
donne `https://thatmuch.fr/`, sans `/audit-refonte`. Next résout les URLs
relatives contre `metadataBase` seul ; il **n'y ajoute jamais le `basePath`**,
contrairement à `next/link` ou `next/image`, qui le préfixent automatiquement.
Correction tentée : inclure le `basePath` directement dans `metadataBase`
(`new URL("https://thatmuch.fr/audit-refonte/")`).

**Second piège, provoqué par la correction du premier.** Une fois une image
Open Graph statique ajoutée (convention `opengraph-image.png`, détectée
automatiquement par Next sans déclaration explicite), `og:image` s'est mis à
pointer vers `.../audit-refonte/audit-refonte/opengraph-image.png` — le
`basePath` **dupliqué**. Cause : ce mécanisme-là résout déjà le fichier avec le
`basePath` inclus, en interne, avant même de tenir compte de `metadataBase`. Il
n'est donc **pas cohérent** avec la résolution des chemins relatifs classiques
(`alternates.canonical`, `openGraph.url`), qui elle en a besoin.

**La règle appliquée.** Les deux mécanismes ne peuvent pas être satisfaits par
un seul réglage global : `metadataBase` reste l'**origine seule**
(`https://thatmuch.fr`), et chaque page préfixe elle-même `BASE_PATH` — importé
depuis `src/lib/site.ts`, seule source de vérité, elle-même relue par
`next.config.ts` — dans son `canonical` et son `openGraph.url`. Ne couvre pas
`$base-path` dans `src/scss/_vars.scss`, que Next ne peut pas atteindre : ce
fichier reste à resynchroniser à la main si le sous-dossier change un jour,
comme c'était déjà le cas avant cette leçon.

**Ce que ça dit plus largement.** Aucun des deux bugs — dénominateur manquant,
puis dupliqué — ne casse le build ni les tests : les deux ne se voient que dans
le HTML produit (`out/*.html`). Toute modification touchant `metadataBase`,
`canonical`, ou une image de partage doit se vérifier après coup sur la sortie
réelle, jamais sur la seule lecture du code.

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
