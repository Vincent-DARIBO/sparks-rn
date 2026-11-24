import type { ListRenderItem } from '@shopify/flash-list';
import { useCallback } from 'react';

import ProductListCell from '../components/ProductListCell';
import type { Product } from '../types';

interface UseCatalogRenderItemParams {
  columns: number;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onOpenProduct: (id: string) => void;
}

/**
 * Fournit un `renderItem` STABLE (useCallback) : FlashList ne recrée pas
 * toutes les cellules à chaque rendu de l'écran (saisie de recherche, etc.).
 * Fichier `.tsx` : le hook retourne du JSX.
 */
export default function useCatalogRenderItem(params: UseCatalogRenderItemParams) {
  const { columns, isFavorite, onToggleFavorite, onAdjustQuantity, onOpenProduct } = params;

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductListCell
        product={item}
        columns={columns}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={onToggleFavorite}
        onAdjustQuantity={onAdjustQuantity}
        onPress={onOpenProduct}
      />
    ),
    [columns, isFavorite, onToggleFavorite, onAdjustQuantity, onOpenProduct],
  );

  return { renderItem };
}
