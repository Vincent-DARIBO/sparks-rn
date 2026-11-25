import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Product } from '../types';
import { getStockStatus } from '../utils/stock';
import useProductFilters from './useProductFilters';

/** Largeur (en points) à partir de laquelle on passe sur deux colonnes (tablette, paysage). */
const TWO_COLUMNS_BREAKPOINT = 600;

/**
 * Logique de l'écran Catalogue : nombre de colonnes, safe areas,
 * statistiques, filtres et libellé des favoris.
 */
export default function useCatalog(products: Product[], favoritesCount: number) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // useWindowDimensions se met à jour à la rotation de l'écran
  // (contrairement à Dimensions.get, lu une seule fois).
  const { width } = useWindowDimensions();
  const columns = width >= TWO_COLUMNS_BREAKPOINT ? 2 : 1;
  const filters = useProductFilters(products);

  // Les statistiques portent sur tout l'inventaire, pas sur le résultat filtré.
  // useMemo : recalculées seulement quand la liste change (utile à 5 000 produits).
  const stats = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const p of products) {
      const status = getStockStatus(p.quantity, p.minQuantity);
      if (status === 'low') low += 1;
      if (status === 'out') out += 1;
    }
    return { total: products.length, low, out };
  }, [products]);

  // Pluriel selon la langue : « 0 produit en favori », « 2 produits en favori » / « 0 favorite products ».
  const favoritesLabel = t('catalog.favorites', { count: favoritesCount });

  return { insets, columns, stats, favoritesLabel, ...filters };
}
