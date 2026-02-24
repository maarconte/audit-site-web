---
trigger: always_on
---

<!--
title: Règles de génération de messages de commit Git
description: Ce document décrit les règles strictes pour la génération de messages de commit Git. Ces règles garantissent la lisibilité de l'historique, la possibilité pour les outils automatisés d'analyser les changements, et la clarté de l'intention de chaque modification.
-->

# Règles de génération de messages de commit Git

Ce document décrit les règles strictes pour la génération de messages de commit Git. Ces règles garantissent la lisibilité de l'historique, la possibilité pour les outils automatisés d'analyser les changements, et la clarté de l'intention de chaque modification.

***

### 1. Spécification du format

-   **Standard**: Suivre la spécification Conventional Commits.
    -   Format: `type(scope): description`
    -   Common Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
-   **Texte brut uniquement**: Le message de commit final doit être en texte brut. **Texte brut**.
    -   **No Markdown**: Ne pas utiliser de gras (**), d'italique (*) ou de blocs de code (`).
    -   **Allowed Symbols**: Vous POUVEZ utiliser la ponctuation et les symboles standard pour plus de clarté (ex : -, :, (), []).

***

### 2. Title Line (Header)

La première ligne est la partie la plus importante du message de commit.

-   **Content**: Un résumé fort et concis de l'ensemble du changement.
-   **Context**: Inclure les informations contextuelles critiques (ex : dates de réunions, releases ou changements urgents).
-   **Length**:
    -   **Ideal**: < 50 caractères.
    -   **Hard Limit**: 72 caractères.
-   **Case**: Utiliser **l'impératif** (ex : "add feature" et non "added feature" ou "adds feature").
-   **Punctuation**: Ne pas terminer la ligne de titre par un point.

***

### 3. Body (Description)

Le corps fournit le contexte détaillé.

-   **Separation**: Il doit y avoir une ligne vide entre le titre et le corps.
-   **Structure**: Utiliser des listes à puces (- ) pour tous les détails. Ne pas utiliser de paragraphes de texte.
-   **Wrapping**: Revenir à la ligne à **72 caractères**.
-   **Content**:
    -   Se concentrer sur ce **qui** a changé et **pourquoi**.
    -   Résumer l'impact des changements.
-   **Pas de redondance**: Ne pas répéter les informations déjà mentionnées dans le titre. Fournir uniquement des détails supplémentaires.

***

### 4. Example

**Format correct :**

```text
feat(auth): implement JWT token refresh strategy

Update the authentication flow to handle expired tokens automatically
without forcing a user logout.

- Add 'RefreshToken' service to handle token rotation.
- Update 'AuthInterceptor' to catch 401 errors.
- Add unit tests for token expiration scenarios.
- Update API documentation with new endpoint details.
```

**Incorrect Format:**

```text
Added new auth features

I added a new way to handle tokens so that users don't get logged out.
It uses a new service and I also updated the interceptor.
**Changes:**
* `RefreshToken` service
* Tests
```

### 5. Commits de synchronisation de sous-modules (Dépôt parent)

- Le titre doit résumer la mise à jour du sous-module et son impact (ex : chore(submodule): sync [nom-du-sous-module] with [changement clé]).
- Le corps doit lister les changements clés introduits par la mise à jour du sous-module, en se basant sur les messages de commit du sous-module.
- Ne pas inclure uniquement le SHA du commit ; toujours résumer les changements réels.
- Ne pas répéter les informations du titre dans le corps.
- Utiliser des listes à puces pour tous les détails, revenir à la ligne à 72 caractères, et suivre toutes les autres règles de formatage et de style.
