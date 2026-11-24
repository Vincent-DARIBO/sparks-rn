# Plan : Scan'Stock, Jour 4 (D7 et SCAN-19 à SCAN-29)

## Context

Les Jours 1 à 3 sont faits : 21 PR ouvertes et empilées (#49 à #69), jamais mergées, et 12 branches de reprise jusqu'à `etape-09-animations`. Le dépôt est propre sur `scan-18-supprimer-un-produit-d-un-geste`. Il reste le Jour 4 : la démonstration D7 et 11 tickets, pour finir la formation. Même objectif qu'avant : chaque élève lit l'énoncé (issue), le corrigé (PR ouverte, diff du seul ticket) et peut repartir d'une branche `etape-XX`.

Règles déjà fixées avec toi, inchangées :
- PR jamais mergées, empilées ; `api/db.json` remis à zéro avant chaque commit.
- Agents d'implémentation et testeur argent sur **Sonnet** ; revue sur le modèle par défaut ; React Doctor sur Sonnet.
- Tests argent sur le **simulateur iOS** seulement ; le téléphone Android n'est pas touché.
- Tickets optionnels SCAN-B10 à B12 : issues seulement.
- Arrêt à la fin du Jour 4, avec mise à jour de `CLAUDE.md` et de la note de reprise.

## Approach

### Boucle par ticket (identique aux jours précédents)

1. Branche du ticket depuis la branche précédente.
2. `aidd-dev:implementer` (Sonnet), avec le brief commun, le ticket, sa correction et la branche de référence.
3. `bunx tsc --noEmit`, `bunx expo lint`, et **`bun run test` à partir de SCAN-19**.
4. En parallèle : testeur argent (Sonnet), `aidd-dev:reviewer`, `react-doctor-reviewer`.
5. Correctifs renvoyés à l'implémentation, retest ciblé.
6. Commit, push, `gh pr create --base <branche précédente>`, milestone « Jour 4 », labels du ticket.

Les briefs existent encore (`BRIEF.md`, `BRIEF-TEST.md` dans le scratchpad de la session précédente) ; je les recopie dans le scratchpad courant et j'y ajoute la règle des tests Jest.

### Chaîne des branches

| Étape | Branche | Base de la PR | Branche de reprise poussée |
|---|---|---|---|
| D7 | `d7-depart-jour-4` | `scan-18-…` | `etape-10-depart` |
| SCAN-19 | `scan-19-tester-le-formulaire-produit` | D7 | |
| SCAN-20 | `scan-20-tester-la-gestion-du-stock` | SCAN-19 | |
| SCAN-21 | `scan-21-rejouer-un-parcours-avec-maestro` | SCAN-20 | |
| SCAN-22 | `scan-22-le-catalogue-ralentit` | SCAN-21 | `etape-10-qualite` |
| SCAN-23 | `scan-23-installer-comme-une-vraie-application` | SCAN-22 | |
| SCAN-24 | `scan-24-corriger-sans-reinstaller` | SCAN-23 | |
| SCAN-25 | `scan-25-verifier-et-publier-a-chaque-push` | SCAN-24 | `etape-11-livraison` |
| SCAN-26 | `scan-26-accessibilite` | SCAN-25 | `etape-12-accessibilite` |
| SCAN-27 | `scan-27-scan-stock-en-anglais` | SCAN-25 | `etape-12-i18n` |
| SCAN-28 | `scan-28-scan-stock-dans-un-navigateur` | SCAN-25 | `etape-12-web` |
| SCAN-29 | `scan-29-decrire-un-produit-par-sa-photo` | SCAN-25 | `etape-12-ia` |

Les quatre modules à la carte partent tous de SCAN-25 : quatre PR parallèles, non empilées entre elles, pour qu'un élève puisse n'en prendre qu'un. Ils sont faits l'un après l'autre (un seul dépôt de travail).

### Ce que fait chaque étape, et ce qui change par rapport aux supports

- **D7** : régression de performances volontaire, reprise du delta de la référence (3 fichiers : la carte reçoit de nouveau le favori par ses props, la route recrée ses fonctions). L'app doit fonctionner comme à la fin du Jour 3 ; en « Démo perfs », une étoile re-rend toutes les cartes visibles. Preuve par comptage des rendus, comme en SCAN-14.
- **SCAN-19** : Jest, `jest-expo`, React Native Testing Library 14, `jest.setup.ts` avec les doublures des modules natifs, script `test`. Quatre tests de `ProductForm`. Les trois critères « casser le code fait échouer le test » sont rejoués par l'agent, puis annulés.
- **SCAN-20** : tests de la mise à jour optimiste. **Écart assumé** : le ticket parle de deux hooks, `useAdjustStock` et `useAdjustQuantity` ; en SCAN-13 ils ont été réunis en un seul, `useAdjustQuantity`. Les quatre tests portent sur ce hook, et la PR l'explique.
- **SCAN-21** : scénario `.maestro/flows/ajuster-stock.yaml`, `testID` sur la quantité de la fiche. La CLI `maestro` 2.5.1 est installée : le scénario est **exécuté sur le simulateur iOS** (deux fois de suite), pas sur Android comme le suggère le ticket.
- **SCAN-22** : mesurer puis corriger la régression de D7. Le tableau avant / après du ticket est rempli avec le nombre de `ProductCard` rendues, compté sur simulateur. La durée en millisecondes du profiler React DevTools reste à mesurer en séance.
- **SCAN-23** : `expo-updates`, `eas.json` (profils `preview` et `simulator`), identifiant `dev.scanstock.app`, `runtimeVersion`, ligne « Mise à jour » dans les Réglages.
- **SCAN-24** : correction du texte des Réglages, composant d'état de mise à jour (`useUpdates`), recherche et application depuis les Réglages.
- **SCAN-25** : `.eas/workflows/preview.yml` (vérification, tests, puis publication) et `build-preview.yml` (à la demande), validés par l'outil de validation des workflows.
- **SCAN-26** : carte lue en une phrase, actions d'accessibilité, quantité réglable, en-têtes, zones de 44 points, grande taille de texte, test RNTL par rôle. Ce ticket ajoute aussi l'alternative au glissement de suppression laissée de côté en SCAN-18.
- **SCAN-27** : `i18next`, `react-i18next`, `expo-localization`, traductions en TypeScript, choix de la langue dans les Réglages (store existant), pluriels, formats `Intl`, test d'égalité des clés.
- **SCAN-28** : `react-native-web`, `@expo/metro-runtime`, fichiers `.web.tsx`, trois colonnes à partir de 1 024 px, scanner par saisie, stockage dans le navigateur (`expo-sqlite` demande une configuration propre au web : à traiter ici).
- **SCAN-29** : serveur Node sans dépendance dans `ai/`, `ai/.env.example`, script `ai`, `expo-image-manipulator`, sortie structurée validée par Zod, section « Description » de la fiche.

Le code de la référence qui ne correspond à aucun ticket (par exemple `src/shared/monitoring/sentry.ts`) n'est pas repris.

## Limites connues, annoncées avant de commencer

- **EAS (SCAN-23 à 25)** : les fichiers sont écrits et vérifiés localement, mais je ne lance ni `eas init`, ni build, ni publication. Ces commandes agissent sur ton compte expo.dev et demandent une connexion interactive. Critères non vérifiés : build réussi, APK installé, mise à jour reçue sur le téléphone, workflow déclenché. De plus, le workflow se déclenche sur un push vers `main`, qui ne reçoit jamais de merge dans ce dépôt.
- **SCAN-29** : `ANTHROPIC_API_KEY` est absente. Le serveur et l'app sont testés avec une réponse simulée ; la description réelle d'une photo n'est pas vérifiée. Si tu ajoutes la clé dans `ai/.env` (jamais dans la conversation), le test de bout en bout devient possible.
- **SCAN-26** : VoiceOver et l'*Accessibility Inspector* de Xcode ne sont pas pilotables. Vérification par l'arbre d'accessibilité du simulateur et par le test RNTL.
- **Android** : rien n'est testé sur Android.
- **Dépense** : douze cycles complets restent à faire. La limite mensuelle a déjà été atteinte une fois ; si elle l'est de nouveau, les agents s'arrêtent en cours de tâche et je reprends après réinitialisation.

## Files to modify

- `package.json`, `bun.lock` : dépendances de test (SCAN-19), `expo-updates` (SCAN-23), i18n (SCAN-27), web (SCAN-28), `expo-image-manipulator` (SCAN-29) ; scripts `test`, `typecheck`, `ai`.
- `jest.setup.ts`, `tsconfig.json` (types Jest), `src/test/renderWithProviders.tsx`.
- `src/features/products/components/__tests__/ProductForm.test.tsx`, `hooks/__tests__/useAdjustQuantity.test.tsx`, `utils/__tests__/*.test.ts`.
- `.maestro/flows/ajuster-stock.yaml`.
- `src/features/products/components/ProductCard.tsx`, `src/app/(tabs)/index.tsx` : dégradés en D7, corrigés en SCAN-22.
- `app.json`, `eas.json`, `.eas/workflows/*.yml`, `src/features/settings/` (ligne et état de mise à jour).
- SCAN-26 : `ProductCard`, `ProductDetailScreen`, écrans du scanner, hooks d'accessibilité.
- SCAN-27 : `src/i18n/`, écrans et composants traduits, `src/shared/stores/settingsStore.ts`.
- SCAN-28 : fichiers `*.web.tsx`, `StorageService` pour le web, configuration Metro si nécessaire.
- SCAN-29 : `ai/server.mjs`, `ai/.env.example`, `.gitignore`, service, hook de mutation et section « Description ».
- `README.md` : une ligne par branche de reprise, commandes `bun run test` et Maestro.
- `CLAUDE.md` : section « Current state », en fin de parcours.
- `aidd_docs/tasks/2026-11-25-scan-stock-jour-4.md` : copie de ce plan.

## Verification

- Par ticket : `bunx tsc --noEmit`, `bunx expo lint`, `bun run test` (dès SCAN-19, y compris `--randomize` pour SCAN-20), revue contre les critères d'acceptation, React Doctor (seuil 80).
- Test argent sur simulateur iOS, json-server lancé :
  - tickets visibles (D7, SCAN-22, 23, 24, 26, 27, 29) : critères du ticket et non-régression ;
  - tickets sans effet visible (SCAN-19, 20, 25) : court parcours de non-régression, les critères étant couverts par Jest ou listés en « Non vérifié » ;
  - SCAN-21 : `maestro test -e EXPO_URL=exp://127.0.0.1:8081 .maestro/flows/ajuster-stock.yaml`, deux fois de suite ;
  - SCAN-27 : simulateur passé en anglais, puis remis en français ;
  - SCAN-28 : navigateur piloté par Playwright ou argent, à 1 280 px et 390 px, et `bunx expo export --platform web`.
- À chaque branche de reprise : clone frais, `bun install`, `bunx tsc --noEmit`, et `bun run test` à partir de `etape-10-qualite`.
- Fin de parcours : `gh pr list` (33 PR ouvertes), `git branch -r` (18 branches `etape-*`), 45 issues ouvertes ; `stop-all-simulator-servers` limité au simulateur utilisé, question sur l'arrêt de Metro.
