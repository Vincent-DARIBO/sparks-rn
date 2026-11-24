/**
 * ÉTAPE 02 — TypeScript et React
 *
 * SCAN-01 : types métier (src/features/products/types.ts), fonction pure
 * de statut (src/features/products/utils)
 * et composants typés (src/features/products/components) pour afficher le catalogue.
 * SCAN-02 : hooks personnalisés (src/features/products/hooks,
 * src/shared/hooks) : useStock (état local d'une carte),
 * useToggleSet (générique), useFavorites et useCatalog (useEffect).
 *
 * ÉTAPE 03 — Styles et mise en page
 *
 * SCAN-03 : thème clair / sombre qui suit le réglage du téléphone (src/theme).
 * Couleurs, espacements et tailles de texte sont centralisés dans des jetons.
 * SCAN-04 : safe areas (react-native-safe-area-context) et écran d'accueil
 * responsive (src/features/products/screens) : tuiles de statistiques, 1 ou 2 colonnes.
 * SCAN-05 : fiche produit (src/features/products/screens). La « navigation » est ici un simple
 * état (useSelectedProduct) : on la remplacera par Expo Router au Module 5.
 *
 * ÉTAPE 04 — DÉPART (démonstration D3)
 *
 * Même application, réorganisée par fonctionnalité : src/features/products pour
 * le produit, src/shared pour ce qui sert à plusieurs écrans, src/theme inchangé.
 * L'alias `@/` (tsconfig.json) pointe sur src/ et évite les `../../..`.
 *
 * SCAN-06 : recherche (nom, marque, code-barres) et filtres par catégorie,
 * catalogue en FlatList, icônes Ionicons. L'inventaire est remonté dans
 * useInventory : la carte et la fiche affichent toujours la même quantité.
 *
 * SCAN-07 : catalogue en FlashList (@shopify/flash-list), qui recycle les cellules.
 * renderItem stable (useCatalogRenderItem), carte mémoïsée, et en développement
 * un interrupteur « Démo perfs : 5 000 produits » (usePerformanceDemo).
 */
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { products as initialProducts } from '@/features/products/data/products';
import useFavorites from '@/features/products/hooks/useFavorites';
import useInventory from '@/features/products/hooks/useInventory';
import usePerformanceDemo from '@/features/products/hooks/usePerformanceDemo';
import useSelectedProduct from '@/features/products/hooks/useSelectedProduct';
import CatalogScreen from '@/features/products/screens/CatalogScreen';
import ProductDetailScreen from '@/features/products/screens/ProductDetailScreen';

export default function App() {
  // L'état des favoris vit dans le parent commun à l'en-tête et aux cartes.
  // « Pâte à tartiner 400 g » (id '1') est en favori au lancement.
  const { toggleFavorite, isFavorite, favoritesCount } = useFavorites(['1']);
  // Une seule source de vérité pour les quantités, partagée par les deux écrans.
  const { products, adjustQuantity, replaceAll } = useInventory(initialProducts);
  // Développement uniquement : bascule entre les 12 produits et 5 000 produits générés.
  const { isLargeDataset, toggleLargeDataset } = usePerformanceDemo(initialProducts, replaceAll);
  // Aucun produit sélectionné → catalogue ; un produit sélectionné → sa fiche.
  const { selectedProduct, selectProduct, clearSelection } = useSelectedProduct(products);

  return (
    // Fournit les dimensions des zones sûres à tous les composants enfants.
    <SafeAreaProvider>
      {selectedProduct ? (
        <ProductDetailScreen
          product={selectedProduct}
          isFavorite={isFavorite(selectedProduct.id)}
          onToggleFavorite={toggleFavorite}
          onAdjustQuantity={adjustQuantity}
          onBack={clearSelection}
        />
      ) : (
        <CatalogScreen
          products={products}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          favoritesCount={favoritesCount}
          onAdjustQuantity={adjustQuantity}
          onOpenProduct={selectProduct}
          isLargeDataset={isLargeDataset}
          onToggleLargeDataset={toggleLargeDataset}
        />
      )}

      {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
