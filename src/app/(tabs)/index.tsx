import { router } from 'expo-router';

import useInventoryContext from '@/features/products/hooks/useInventoryContext';
import CatalogScreen from '@/features/products/screens/CatalogScreen';

// Route dynamique : `/product/1`, `/product/2`… (fichier product/[id]/index.tsx).
// Fonction définie hors du composant : sa référence est stable, la liste mémoïsée
// n'est donc pas redessinée à chaque rendu.
const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });

/**
 * Route `/` (onglet Catalogue).
 *
 * Les fichiers de `src/app` restent minces : ils relient la navigation et
 * les données aux écrans de `src/features`, qui ne savent rien du routeur.
 *
 * La fiche produit est une route de la pile, empilée PAR-DESSUS les onglets : le catalogue
 * reste monté dessous, la recherche et le filtre sont retrouvés au retour.
 */
export default function CatalogRoute() {
  const inventory = useInventoryContext();

  return (
    <CatalogScreen
      products={inventory.products}
      isFavorite={inventory.isFavorite}
      onToggleFavorite={inventory.toggleFavorite}
      favoritesCount={inventory.favoritesCount}
      onAdjustQuantity={inventory.adjustQuantity}
      onOpenProduct={openProduct}
      isLargeDataset={inventory.isLargeDataset}
      onToggleLargeDataset={inventory.toggleLargeDataset}
    />
  );
}
