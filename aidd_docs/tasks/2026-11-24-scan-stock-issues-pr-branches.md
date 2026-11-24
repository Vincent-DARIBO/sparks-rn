# Plan : Scan'Stock découpé en issues, PR, branches et milestones

## Context

`sparks-rn` (GitHub `Vincent-DARIBO/sparks-rn`, public) ne contient que le template Expo vierge sur `main`. Les supports de formation (`../tickets`, `../corrections`) décrivent 41 tickets sur 4 jours et citent des branches `etape-XX-*` qui n'existent pas dans ce dépôt. Objectif : reconstruire l'app ticket par ticket et publier une structure GitHub où chaque élève peut, à tout moment de la formation, lire l'énoncé (issue), voir le corrigé (PR) et repartir d'un état propre (branche `etape-XX`).

Décisions prises avec toi :
- 1 issue + 1 branche + 1 PR par ticket, mergées dans l'ordre sur `main`.
- Les 4 jours en une seule exécution.
- Tickets optionnels SCAN-B1 à B12 : issues seulement. Exception : la clé de contrôle EAN-13 (B5) est codée dans SCAN-11, car le test obligatoire SCAN-19 en dépend.
- Agents d'implémentation en Opus.

## Sources de code, par ordre de priorité

1. **Critères d'acceptation des tickets** (`../tickets/jour N/SCAN-XX-*.md`) : définition de terminé.
2. **Corrections actuelles** (`../corrections/jour N/SCAN-XX.md`) : code cible quand il est donné.
3. **Archive `../old/Jour 4 /scan-stock-formation-complete.zip`** : dépôt git de référence avec 24 branches `etape-*` complètes. Elle comble les trous des corrections (données `products.ts`, `api/db.json`, `NumberStepper`, `CategoryChips`, `SettingsScreen`, `_layout.tsx` successifs, etc.). Elle est dans `old/` : en cas de désaccord, les sources 1 et 2 gagnent.

Adaptations systématiques par rapport à l'archive : bun au lieu de npm (`bun.lock`, pas de `package-lock.json`), libs installées par `bunx expo install` au ticket qui en a besoin, API vérifiées contre la doc Expo SDK 58 (`https://docs.expo.dev/versions/v58.0.0/`), architecture service + AppError, hook, composant, commentaires pédagogiques en français.

## Approach

### Étape 0 : préparation (aucun code d'app)

- Extraire l'archive dans le scratchpad, lister ses branches, comparer chaque `etape-XX` aux corrections actuelles et noter les écarts (branches en trop : `etape-12-achats`, `etape-08-dev-build`, `etape-05-bonus-react-navigation`, ignorées).
- Enregistrer ce plan dans `aidd_docs/tasks/2026-11-24-scan-stock-issues-pr-branches.md`.
- Pousser `etape-00-depart` = `main` actuel.

### Étape 1 : structure GitHub (`gh`)

- **Milestones** : `Jour 1 — Fondations`, `Jour 2 — Construire l'application`, `Jour 3 — Données, natif et animations`, `Jour 4 — Qualité, livraison et modules à la carte`.
- **Labels** : `jour-1` à `jour-4`, `module-2` à `module-12`, `optionnel`, `demonstration` (ceux des en-têtes de tickets).
- **Issues**, créées dans cet ordre pour que le numéro GitHub colle au ticket (#1 = SCAN-01 … #29 = SCAN-29) :
  1. SCAN-01 à SCAN-29, corps = fichier ticket tel quel (`gh issue create --body-file`), milestone et labels du ticket.
  2. SCAN-B1 à B12, label `optionnel`.
  3. Issues `demonstration` pour les états de départ sans ticket : D1-D2, départ Jour 2, D5 (API json-server), D7 (départ Jour 4).

### Étape 2 : boucle par ticket (répétée 29 fois + démonstrations)

Pour chaque ticket, dans l'ordre de la chaîne ci-dessous :

1. Branche `scan-XX-slug` depuis `main` à jour.
2. `aidd-dev:implementer` (Opus) reçoit : le ticket, sa correction, la branche de l'archive correspondante, les règles d'architecture. Il ne code que le périmètre du ticket.
3. Contrôles : `bunx tsc --noEmit`, `bunx expo lint`, `bun run test` à partir de SCAN-19.
4. **Test argent de la branche** (obligatoire, avant toute PR) : app lancée sur simulateur iOS, parcours des critères d'acceptation du ticket via les outils argent (`describe`, `gesture-tap`, `keyboard`, `await-ui-element`, `screenshot`). Un critère en échec renvoie à l'implementer. La PR liste les critères vérifiés et ceux qui ne peuvent pas l'être sur simulateur.
5. `aidd-dev:reviewer` sur le diff, avec les critères d'acceptation comme validateur, plus `react-doctor-reviewer` (seuil 80). Verdict `iterate` : retour à l'implementer avec la liste des écarts.
6. Commit conventionnel, PR vers `main` : titre `SCAN-XX — <titre>`, corps avec `Closes #N`, milestone du jour, labels du ticket.
7. Merge en squash (un commit par ticket sur `main`), suppression de la branche de travail.
8. Si le ticket termine une étape : pousser la branche `etape-XX-nom` sur le `main` obtenu, puis la retester avec argent (parcours de non-régression des tickets de l'étape).

### Chaîne des tickets et branches de reprise

| Jour | Séquence sur `main` | Branche poussée après |
|---|---|---|
| 1 | D1-D2 (données, `useDebugCounter`, config ESLint) | `etape-01-fondations` |
| 1 | SCAN-01, SCAN-02 | `etape-02-typescript-react` |
| 1 | SCAN-03, SCAN-04, SCAN-05 | `etape-03-styles` |
| 2 | Départ Jour 2 (passage à `src/features` + `src/shared`, alias `@/`) | `etape-04-depart` |
| 2 | SCAN-06, SCAN-07 | `etape-04-listes` |
| 2 | SCAN-08, SCAN-09 | `etape-05-navigation` |
| 2 | SCAN-10, SCAN-11 (+ clé EAN-13) | `etape-06-formulaires` |
| 3 | D5 (json-server, `api/db.json`, `api/db.seed.json`, scripts `api`) | `etape-07-depart` |
| 3 | SCAN-12, SCAN-13, SCAN-14 | `etape-07-donnees` |
| 3 | SCAN-15, SCAN-16 | `etape-08-natif` |
| 3 | SCAN-17, SCAN-18 | `etape-09-animations` |
| 4 | D7 (régression de perfs volontaire, reprise de l'archive) | `etape-10-depart` |
| 4 | SCAN-19, SCAN-20, SCAN-21, SCAN-22 | `etape-10-qualite` |
| 4 | SCAN-23, SCAN-24, SCAN-25 | `etape-11-livraison` |
| 4 | SCAN-26, SCAN-27, SCAN-28, SCAN-29 | voir ci-dessous |

Modules à la carte (SCAN-26 à 29) : chacun est développé sur sa branche `etape-12-accessibilite`, `etape-12-i18n`, `etape-12-web`, `etape-12-ia`, toutes parties de `etape-11-livraison`. Ces 4 branches restent telles quelles (un élève peut n'en prendre qu'une). Chacune a aussi sa PR vers `main`, mergée à la suite avec résolution des conflits, pour que `main` contienne l'app complète.

Le passage à `src/features` est isolé dans le « Départ Jour 2 » plutôt que dans SCAN-06, pour que la PR SCAN-06 ne montre que la recherche et les filtres. Le ticket SCAN-06 part justement de `etape-04-depart`.

## Files to modify

- `App.tsx`, `index.ts` : utilisés au Jour 1, supprimés en SCAN-08 (entrée `expo-router/entry`).
- `app.json` : nom `Scan'Stock`, `userInterfaceStyle: automatic` (SCAN-03), `scheme` et plugin `expo-router` (SCAN-08), plugins caméra, photos et position avec textes en français (SCAN-15, 16), identifiant `dev.scanstock.app` et `runtimeVersion` (SCAN-23).
- `package.json`, `bun.lock` : une lib par ticket ; scripts `api`, `api:reset`, `test`, `typecheck`, `ai`.
- `tsconfig.json` : alias `@/*`, types Jest.
- `src/` : arborescence à plat au Jour 1 (`components`, `hooks`, `types`, `utils`, `screens`, `data`, `theme`), puis `src/app` (routes), `src/features/{products,scanner,settings}`, `src/shared`, `src/theme`, `src/i18n`, `src/test`.
- Hors `src` : `api/db.json`, `api/db.seed.json`, `jest.setup.ts`, `.maestro/flows/ajuster-stock.yaml`, `eas.json`, `.eas/workflows/*.yml`, `ai/server.mjs`, `ai/.env.example`.
- `CLAUDE.md` : section « Current state » mise à jour en fin de parcours.
- `aidd_docs/tasks/2026-11-24-scan-stock-issues-pr-branches.md` : copie de ce plan.

## Limites connues

Ces points seront écrits et typés, mais pas exécutés par moi :
- **EAS Build, Update, Workflows (SCAN-23 à 25)** : demandent ton compte expo.dev. `eas.json` et les workflows seront en place ; `bunx eas-cli init` (qui écrit le `projectId`) et le premier build restent à faire par toi.
- **Description par IA (SCAN-29)** : demande `ANTHROPIC_API_KEY` dans `ai/.env`, absent du dépôt.
- **Caméra, photo, position (SCAN-15, 16)** : le simulateur iOS n'a pas de caméra ; vérifiés jusqu'à l'écran d'autorisation seulement.
- **Maestro (SCAN-21)** : exécuté seulement si la CLI `maestro` est installée sur ta machine.
- Chaque PR concernée le dira dans une section « Non vérifié ».

## Verification

- Par ticket : `bunx tsc --noEmit`, `bunx expo lint`, tests Jest dès SCAN-19, revue contre les critères d'acceptation, gate react-doctor.
- **Chaque branche est testée avec argent** sur simulateur iOS : les 29 branches de tickets, les branches de démonstration, les branches de reprise `etape-XX` et les 4 branches `etape-12-*`. Exemples de critères rejoués : tuiles 12 / 3 / 1, recherche « coca » = 2 produits, `/product/999` = Introuvable, bascule en thème sombre, `+` qui fait passer « Stock bas » à « En stock ». À partir du Jour 3, json-server tourne pendant le test.
- Tickets sans effet visible (SCAN-19, 20, 22 à 25) : le test argent se réduit à un parcours de non-régression (catalogue, fiche, formulaire), les critères propres au ticket étant couverts par Jest ou listés en « Non vérifié ».
- À chaque `etape-XX` : `git clone` frais de la branche + `bun install` + `bunx tsc --noEmit`, pour garantir qu'un élève peut repartir de là.
- Fin de parcours : `gh issue list`, `gh pr list --state merged` et `git branch -r` confrontés au tableau ci-dessus (29 PR de tickets, 4 milestones, toutes les branches de reprise présentes, 12 issues optionnelles ouvertes).
