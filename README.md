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
```

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

Les branches suivantes seront ajoutées au fil de la formation.

## Arborescence

```
src/app/                 Routes Expo Router : un fichier = un écran
  (tabs)/                Onglets Catalogue, Scanner, Réglages
  product/[id]/          Fiche d'un produit et sa modale de modification
src/features/products/   Tout ce qui concerne les produits
  components/            Composants d'affichage (carte, badge, ligne d'information)
  hooks/                 État et logique (stock, favoris, catalogue)
  screens/               Écrans (catalogue, fiche produit)
  data/                  Données de démonstration
  utils/                 Fonctions pures (statut de stock)
  types.ts               Types TypeScript
src/shared/              Composants et hooks réutilisables partout
src/theme/               Couleurs, espacements, typographie
```

Les imports qui passent d'un dossier à l'autre utilisent l'alias `@/` (`@/theme`, `@/shared/components/Header`). À l'intérieur d'une fonctionnalité, on garde les chemins relatifs.
