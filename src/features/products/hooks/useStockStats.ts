import { useMemo } from 'react';

import type { Product } from '../types';
import { getStockStatus } from '../utils/stock';

/**
 * Totaux d'inventaire : produits, stock bas, ruptures.
 * Recalculés seulement quand la liste de produits change.
 * Limite volontaire : ils partent des données du catalogue, pas des quantités
 * modifiées sur les cartes (état local `useStock`). L'état partagé arrive au Jour 2.
 */
export default function useStockStats(products: Product[]) {
  return useMemo(() => {
    const statuses = products.map((p) => getStockStatus(p.quantity, p.minQuantity));

    return {
      totalCount: products.length,
      lowCount: statuses.filter((s) => s === 'low').length,
      outCount: statuses.filter((s) => s === 'out').length,
    };
  }, [products]);
}
