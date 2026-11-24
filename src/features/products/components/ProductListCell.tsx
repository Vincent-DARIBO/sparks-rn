import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import type { Product } from '../types';
import ProductCard from './ProductCard';
import SwipeableRow from './SwipeableRow';

interface ProductListCellProps {
  product: Product;
  columns: number;
  onAdjustQuantity: (id: string, delta: number) => void;
  onPress: (id: string) => void;
  /** Absent = carte non glissable (démo de performances). */
  onDelete?: (id: string) => void;
}

/**
 * Cellule de la liste : FlashList fixe la largeur de chaque colonne,
 * la cellule ajoute l'espacement (marge basse, et marge latérale en deux colonnes).
 */
export default function ProductListCell(props: ProductListCellProps) {
  const { product, columns, onAdjustQuantity, onPress, onDelete } = props;
  const { styles } = useThemedStyles(createStyles);
  // `onDelete` va aussi à la carte : l'action « Supprimer » du lecteur d'écran remplace le glissement.
  const card = <ProductCard product={product} onAdjustQuantity={onAdjustQuantity} onPress={onPress} onDelete={onDelete} />;

  return (
    <View style={[styles.cell, columns > 1 && styles.cellTwoColumns]}>
      {onDelete ? (
        <SwipeableRow product={product} onDelete={onDelete}>
          {card}
        </SwipeableRow>
      ) : (
        card
      )}
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
