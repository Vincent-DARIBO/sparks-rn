import { useState } from 'react';

import type { Product } from '../types';

/**
 * Navigation minimale par état local : `null` = catalogue affiché,
 * un identifiant = fiche de ce produit affichée. Remplacé par Expo Router au Module 5.
 */
export default function useSelectedProduct(products: Product[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedId);
  const clearSelection = () => setSelectedId(null);

  return { selectedProduct, selectProduct: setSelectedId, clearSelection };
}
