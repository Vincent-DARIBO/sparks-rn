import type { TFunction } from 'i18next';

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

/**
 * Texte du badge de stock, par exemple « En stock · 25 » (« In stock · 25 » en anglais).
 * Un composant passe SON `t` (issu de `useTranslation`) : il se re-rend alors au changement de langue.
 */
export function getStockText(status: StockStatus, quantity: number, t: TFunction): string {
  return t('stock.badge', { label: t(`stock.${status}`), quantity });
}
