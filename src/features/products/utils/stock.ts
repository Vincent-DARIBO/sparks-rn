import type { StockStatus } from '../types';

/**
 * Calcule l'état du stock. Fonction pure : mêmes entrées → même sortie,
 * aucun effet de bord. Facile à tester (on le fera au Module 10).
 */
export function getStockStatus(quantity: number, minQuantity: number): StockStatus {
  if (quantity <= 0) return 'out';
  if (quantity <= minQuantity) return 'low';
  return 'ok';
}

const stockStatusLabels: Record<StockStatus, string> = {
  out: 'Rupture',
  low: 'Stock bas',
  ok: 'En stock',
};

/** Texte du badge de stock, par exemple « En stock · 25 ». */
export function getStockText(status: StockStatus, quantity: number): string {
  return `${stockStatusLabels[status]} · ${quantity}`;
}
