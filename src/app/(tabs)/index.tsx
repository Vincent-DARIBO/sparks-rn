import useInventoryContext from '@/features/products/hooks/useInventoryContext';
import useSelectedProduct from '@/features/products/hooks/useSelectedProduct';
import CatalogScreen from '@/features/products/screens/CatalogScreen';
import ProductDetailScreen from '@/features/products/screens/ProductDetailScreen';

/**
 * Route `/` (onglet Catalogue).
 *
 * Les fichiers de `src/app` restent minces : ils relient la navigation et
 * les données aux écrans de `src/features`, qui ne savent rien du routeur.
 *
 * La fiche produit garde pour l'instant sa « navigation » par état local
 * (useSelectedProduct) : elle deviendra une vraie route au ticket suivant.
 */
export default function CatalogRoute() {
  const inventory = useInventoryContext();
  const { selectedProduct, selectProduct, clearSelection } = useSelectedProduct(inventory.products);

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        isFavorite={inventory.isFavorite(selectedProduct.id)}
        onToggleFavorite={inventory.toggleFavorite}
        onAdjustQuantity={inventory.adjustQuantity}
        onBack={clearSelection}
      />
    );
  }

  return (
    <CatalogScreen
      products={inventory.products}
      isFavorite={inventory.isFavorite}
      onToggleFavorite={inventory.toggleFavorite}
      favoritesCount={inventory.favoritesCount}
      onAdjustQuantity={inventory.adjustQuantity}
      onOpenProduct={selectProduct}
      isLargeDataset={inventory.isLargeDataset}
      onToggleLargeDataset={inventory.toggleLargeDataset}
    />
  );
}
