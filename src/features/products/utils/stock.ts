import { MAX_QUANTITY, type StockStatus } from '../types';

/**
 * Calcule l'état du stock. Fonction pure : mêmes entrées → même sortie,
 * aucun effet de bord. Facile à tester (on le fera au Module 10).
 */
export function getStockStatus(quantity: number, minQuantity: number): StockStatus {
  if (quantity <= 0) return 'out';
  if (quantity <= minQuantity) return 'low';
  return 'ok';
}

/** Garde une quantité entre 0 et MAX_QUANTITY : une valeur hors bornes serait refusée par la validation Zod. */
export function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(0, quantity));
}

export const stockStatusLabels: Record<StockStatus, string> = {
  out: 'Rupture',
  low: 'Stock bas',
  ok: 'En stock',
};

/** Texte du badge de stock, par exemple « En stock · 25 ». */
export function getStockText(status: StockStatus, quantity: number): string {
  return `${stockStatusLabels[status]} · ${quantity}`;
}
