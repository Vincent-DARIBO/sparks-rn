import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import type { Product } from '../types';
import { getStockStatus } from '../utils/stock';
import ProductThumbnail from './ProductThumbnail';
import StockBadge from './StockBadge';

/**
 * Union discriminée sur `kind` : TypeScript sait quelles props existent dans chaque cas
 * (`product` pour un produit connu, `barcode` pour un code inconnu).
 */
type ScannedProductCardProps =
  | { kind: 'known'; product: Product; onOpen: () => void }
  | { kind: 'unknown'; barcode: string; onCreate: () => void };

/** Carte du dernier code lu, en bas de l'écran Scanner. Le scan suivant la remplace. */
export default function ScannedProductCard(props: ScannedProductCardProps) {
  const { styles } = useThemedStyles(createStyles);
  const buttonLabel = props.kind === 'known' ? 'Ouvrir la fiche' : 'Créer ce produit';

  return (
    <View style={styles.card}>
      {props.kind === 'known' ? (
        <View style={styles.row}>
          <ProductThumbnail size={48} photoUri={props.product.photoUri} />
          <View style={styles.texts}>
            <Text style={styles.brand}>{props.product.brand}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {props.product.name}
            </Text>
          </View>
          <StockBadge
            status={getStockStatus(props.product.quantity, props.product.minQuantity)}
            quantity={props.product.quantity}
          />
        </View>
      ) : (
        <View style={styles.texts}>
          <Text style={styles.name}>Produit inconnu</Text>
          <Text style={styles.caption}>{props.barcode} n&apos;est pas dans l&apos;inventaire.</Text>
        </View>
      )}
      <Pressable
        onPress={props.kind === 'known' ? props.onOpen : props.onCreate}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    card: { backgroundColor: colors.surface, borderRadius: radius.md + 4, padding: spacing.lg, gap: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    texts: { flex: 1, gap: 2 },
    brand: { ...typography.overline, color: colors.textMuted },
    name: { ...typography.bodyStrong, color: colors.text },
    caption: { ...typography.caption, color: colors.textMuted },
    button: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.md,
    },
    buttonLabel: { ...typography.bodyStrong, color: colors.onPrimary },
  });
