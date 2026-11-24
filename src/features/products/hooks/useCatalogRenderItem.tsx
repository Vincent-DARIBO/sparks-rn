import type { ListRenderItem } from '@shopify/flash-list';
import { useCallback } from 'react';

import ProductListCell from '../components/ProductListCell';
import type { Product } from '../types';

interface UseCatalogRenderItemParams {
  columns: number;
  onAdjustQuantity: (id: string, delta: number) => void;
  onOpenProduct: (id: string) => void;
}

/**
 * Fournit un `renderItem` STABLE (useCallback) : FlashList ne recrée pas
 * toutes les cellules à chaque rendu de l'écran (saisie de recherche, favori ajouté, etc.).
 * Les favoris n'y figurent plus : chaque carte lit son étoile dans le store. Toucher une
 * étoile ne change donc ni `renderItem`, ni les props des cellules.
 * Fichier `.tsx` : le hook retourne du JSX.
 */
export default function useCatalogRenderItem(params: UseCatalogRenderItemParams) {
  const { columns, onAdjustQuantity, onOpenProduct } = params;

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductListCell
        product={item}
        columns={columns}
        onAdjustQuantity={onAdjustQuantity}
        onPress={onOpenProduct}
      />
    ),
    [columns, onAdjustQuantity, onOpenProduct],
  );

  return { renderItem };
}
