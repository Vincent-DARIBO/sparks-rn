import type { StockStatus } from '../types/product';

/**
 * Calcule l'état du stock. Fonction pure : mêmes entrées → même sortie,
 * aucun effet de bord. Facile à tester (on le fera au Module 10).
 */
export function getStockStatus(quantity: number, minQuantity: number): StockStatus {
  if (quantity <= 0) return 'out';
  if (quantity <= minQuantity) return 'low';
  return 'ok';
}
