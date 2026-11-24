import { useRef } from 'react';

import type { Product } from '../types';
import { getStockStatus } from '../utils/stock';

/**
 * Boutons − / + d'un produit, branchés sur les données du serveur.
 *
 * Remplace `useStock` du Jour 1 : le hook ne stocke plus la quantité, il lit
 * `product.quantity` et signale les changements au parent par `onAdjustQuantity`.
 */
export default function useProductQuantity(
  product: Product,
  onAdjustQuantity: (id: string, delta: number) => void,
) {
  // useRef : quantité au premier affichage, mémorisée SANS nouveau rendu.
  // « Annuler » sur la fiche y revient.
  const initialQuantityRef = useRef(product.quantity);

  const increment = () => onAdjustQuantity(product.id, 1);
  const decrement = () => onAdjustQuantity(product.id, -1);
  const reset = () => onAdjustQuantity(product.id, initialQuantityRef.current - product.quantity);

  return {
    quantity: product.quantity,
    status: getStockStatus(product.quantity, product.minQuantity), // valeur dérivée, pas un état
    increment,
    decrement,
    reset,
  };
}
