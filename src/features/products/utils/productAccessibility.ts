import type { Product } from '../types';
import { getStockStatus, stockStatusLabels } from './stock';

/** « 1 unité », « 6 unités » : en français, 0 et 1 restent au singulier. */
export function formatUnits(quantity: number): string {
  return `${quantity} unité${quantity > 1 ? 's' : ''}`;
}

/**
 * La phrase que le lecteur d'écran dit pour toute la carte, par exemple
 * « Soda cola 33 cl, Coca-Cola, Stock bas, 6 unités » (+ « , favori » si besoin).
 * Fonction pure : facile à tester sans afficher la carte.
 */
export function getProductAccessibilityLabel(product: Product, isFavorite: boolean): string {
  const status = getStockStatus(product.quantity, product.minQuantity);
  const parts = [product.name, product.brand, stockStatusLabels[status], formatUnits(product.quantity)];
  if (isFavorite) parts.push('favori');
  return parts.join(', ');
}
