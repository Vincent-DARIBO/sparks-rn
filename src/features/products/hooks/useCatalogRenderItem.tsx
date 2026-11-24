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
 * Fournit le `renderItem` de la liste (useCallback sur ses dépendances).
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
