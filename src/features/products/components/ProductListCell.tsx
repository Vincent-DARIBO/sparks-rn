import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListCellProps {
  product: Product;
  columns: number;
  onAdjustQuantity: (id: string, delta: number) => void;
  onPress: (id: string) => void;
}

/**
 * Cellule de la liste : FlashList fixe la largeur de chaque colonne,
 * la cellule ajoute l'espacement (marge basse, et marge latérale en deux colonnes).
 */
export default function ProductListCell(props: ProductListCellProps) {
  const { product, columns, onAdjustQuantity, onPress } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={[styles.cell, columns > 1 && styles.cellTwoColumns]}>
      <ProductCard
        product={product}
        onAdjustQuantity={onAdjustQuantity}
        onPress={onPress}
      />
    </View>
  );
}

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    cell: {
      paddingBottom: spacing.md,
    },
    // Deux demi-marges côte à côte = un espace complet entre les colonnes.
    cellTwoColumns: {
      paddingHorizontal: spacing.md / 2,
    },
  });
