# Leçons techniques

Constats issus de problèmes réellement rencontrés sur ce dépôt, conservés pour le
*pourquoi* : chacun explique une décision encore visible dans le code, et que rien
d'autre ne justifierait.

Récupérés du dossier `.jules/`, supprimé après l'arrêt des agents automatiques en
août 2026.

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

## Boucle d'animation canvas laissée tourner à vide

**28/02/2025 · `src/components/ClickSpark/ClickSpark.tsx`**

**Le problème.** Démarrer une boucle `requestAnimationFrame` au montage du composant
et la laisser tourner en permanence — même sans rien à dessiner — consomme
massivement CPU et batterie. Next.js n'optimise pas ça.

**La règle appliquée.** Démarrer l'animation sur interaction (`onClick`), et
**l'arrêter explicitement** (`cancelAnimationFrame`, ou sortie de la récursion) dès
qu'il n'y a plus rien à rendre.
