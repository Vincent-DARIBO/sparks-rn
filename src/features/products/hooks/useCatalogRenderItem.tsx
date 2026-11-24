import type { ListRenderItem } from '@shopify/flash-list';
import { useCallback } from 'react';

import ProductListCell from '../components/ProductListCell';
import type { Product } from '../types';

interface UseCatalogRenderItemParams {
  columns: number;
  onAdjustQuantity: (id: string, delta: number) => void;
  onOpenProduct: (id: string) => void;
  onDeleteProduct?: (id: string) => void;
}

/**
 * Fournit un `renderItem` STABLE (useCallback) : FlashList ne recrée pas
 * toutes les cellules à chaque rendu de l'écran (saisie de recherche, favori ajouté, etc.).
 * Cela suppose que les callbacks reçus soient eux-mêmes stables : si l'un d'eux change à
 * chaque rendu, `renderItem` change aussi (c'est une dépendance) et FlashList re-rend
 * toutes les cellules montées. Les favoris n'y figurent pas : chaque carte lit son étoile
 * dans le store.
 * Fichier `.tsx` : le hook retourne du JSX.
 */
export default function useCatalogRenderItem(params: UseCatalogRenderItemParams) {
  const { columns, onAdjustQuantity, onOpenProduct, onDeleteProduct } = params;

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductListCell
        product={item}
        columns={columns}
        onAdjustQuantity={onAdjustQuantity}
        onPress={onOpenProduct}
        onDelete={onDeleteProduct}
      />
    ),
    [columns, onAdjustQuantity, onOpenProduct, onDeleteProduct],
  );

  return { renderItem };
}
