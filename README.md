# Scan'Stock — projet fil rouge de la formation React Native

Application de gestion d'inventaire : on scanne le code-barres d'un produit,
on consulte sa fiche, on ajuste le stock, on photographie le produit et on
enregistre son emplacement.

**Socle technique** : Expo SDK 58 · React Native 0.88 (New Architecture) ·
React 19.3 · TypeScript · bun

## Démarrer

```bash
bun install
bunx expo start
```

Puis scannez le QR code affiché avec Expo Go (Android) ou l'appareil photo (iOS).
Dans le terminal Expo : `j` ouvre React Native DevTools, `r` recharge l'app,
`m` ouvre le menu développeur.

> **Ajouter une librairie** : toujours `bunx expo install <paquet>` (et non
> `bun add`) — la commande choisit la version compatible avec le SDK.

Avant de pousser du code :

```bash
bunx tsc --noEmit   # vérification des types
bunx expo lint      # ESLint
bun run test        # tests Jest (à partir du Jour 4)
```

> `bun run test` lance Jest. `bun test`, sans `run`, lance l'exécuteur de tests
> de Bun, qui ne convient pas à ce projet. Au tout premier lancement, Jest peut
> rester silencieux une minute ou deux si `watchman` indexe le dépôt.

## L'API de démonstration (à partir du Jour 3)

L'inventaire est servi par une API REST simulée, [json-server](https://github.com/typicode/json-server), qui demande Node 22.12 ou plus.

```bash
bun run api         # démarre l'API sur le port 3000, à partir de api/db.json
bun run api:reset   # remet l'inventaire dans son état de départ
```

Les modifications faites par l'app sont écrites dans `api/db.json`. Lancez `bun run api:reset` avant de commiter, pour ne pas embarquer vos données de test.

Sur un simulateur ou un émulateur du même ordinateur, l'adresse par défaut `http://localhost:3000` suffit. Sur un téléphone, `localhost` désigne le téléphone lui-même : copiez `.env.example` en `.env.local` et mettez-y l'adresse IP de votre ordinateur (celle affichée par `bunx expo start`), puis relancez Expo.

## Tickets, issues et corrigés

Chaque ticket de la formation est une **issue GitHub** (user story, règles
métier, critères d'acceptation). Son corrigé est une **pull request** : lisez
son diff pour voir exactement ce que l'étape ajoute.

## Une branche par étape

Chaque étape de la formation a sa branche. Si vous êtes en retard ou si
votre code ne fonctionne plus, repartez de la branche de l'étape précédente :

```bash
git fetch
git switch etape-01-fondations   # par exemple
bun install
```

| Branche | Contenu |
|---|---|
| `etape-00-depart` | Projet généré par `create-expo-app` |
| `etape-01-fondations` | Jeu de données, écran d'accueil, premiers pas avec React Native DevTools |
| `etape-02-typescript-react` | Types, composants typés, hooks personnalisés (SCAN-01, SCAN-02) |
| `etape-03-styles` | Thème clair/sombre, mise en page, zones sûres, fiche produit (SCAN-03 à SCAN-05) |
| `etape-04-depart` | Départ du Jour 2 : organisation par fonctionnalité et alias `@/` |
| `etape-04-listes` | Recherche, filtres par catégorie, liste fluide avec FlashList (SCAN-06, SCAN-07) |
| `etape-05-navigation` | Expo Router : onglets, fiche produit par son adresse, modale, lien profond (SCAN-08, SCAN-09) |
| `etape-06-formulaires` | Formulaires avec React Hook Form, validation Zod, gestion du clavier (SCAN-10, SCAN-11) |
| `etape-07-depart` | Départ du Jour 3 : API REST simulée avec json-server |
| `etape-07-donnees` | Données du serveur avec TanStack Query, écritures optimistes, favoris et réglages persistés avec Zustand (SCAN-12 à SCAN-14) |
| `etape-08-natif` | Fonctionnalités natives : scanner de codes-barres, photo et emplacement d'un produit (SCAN-15, SCAN-16) |
| `etape-09-animations` | Animations avec Reanimated, suppression d'un produit par glissement (SCAN-17, SCAN-18) |
| `etape-10-depart` | Départ du Jour 4 : le catalogue ralentit, à vous de trouver pourquoi |

Les branches suivantes seront ajoutées au fil de la formation.

## Arborescence

```
src/app/                 Routes Expo Router : un fichier = un écran
  (tabs)/                Onglets Catalogue, Scanner, Réglages
  product/[id]/          Fiche d'un produit et sa modale de modification
src/features/products/   Tout ce qui concerne les produits
  components/            Composants d'affichage (carte, badge, ligne d'information)
  hooks/                 État et logique (stock, favoris, catalogue)
  services/              Accès à l'API et erreurs associées
  screens/               Écrans (catalogue, fiche produit)
  data/                  Données de démonstration
  utils/                 Fonctions pures (statut de stock)
  stores/                État conservé sur le téléphone (favoris)
  types.ts               Types TypeScript
src/features/settings/   L'écran Réglages
src/features/scanner/    La caméra et la lecture des codes-barres
src/shared/              Composants et hooks réutilisables partout
src/theme/               Couleurs, espacements, typographie
```

Les imports qui passent d'un dossier à l'autre utilisent l'alias `@/` (`@/theme`, `@/shared/components/Header`). À l'intérieur d'une fonctionnalité, on garde les chemins relatifs.
