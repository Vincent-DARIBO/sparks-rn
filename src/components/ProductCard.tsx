import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import useStock from '../hooks/useStock';
import { useThemedStyles, type Theme } from '../theme';
import { categoryLabels, type Product } from '../types/product';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  /** Callback remonté au parent : c'est lui qui possède l'état des favoris. */
  onToggleFavorite: (id: string) => void;
  /** Style fourni par le parent : ici la largeur calculée par `useHomeLayout`. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Carte produit.
 *
 * - La QUANTITÉ est un état local à la carte (hook useStock) : aucun autre
 *   composant n'en a besoin pour l'instant.
 * - Les FAVORIS sont un état du parent (App) : il les compte dans l'en-tête.
 *   La carte reçoit la valeur en prop et signale les changements par callback.
 *   → Les données descendent, les événements remontent.
 * - Sa LARGEUR est imposée par le parent (prop `style`) : la grille décide.
 */
export default function ProductCard(props: ProductCardProps) {
  const { product, isFavorite, onToggleFavorite, style } = props;
  const { styles } = useThemedStyles(createStyles);
  const { quantity, status, increment, decrement } = useStock(
    product.quantity,
    product.minQuantity,
  );

  return (
    // Tableau de styles : le style de base, puis celui imposé par le parent.
    <View style={[styles.card, style]}>
      {/* Image locale provisoire : require() est résolu au moment du build par Metro */}
      <Image source={require('../../assets/icon.png')} style={styles.thumbnail} />

      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{categoryLabels[product.category]}</Text>
        <StockBadge status={status} quantity={quantity} />

        <View style={styles.actions}>
          <Pressable
            style={styles.stepper}
            onPress={decrement}
            disabled={quantity === 0}
            accessibilityLabel="Retirer une unité"
          >
            <Text style={styles.stepperLabel}>−</Text>
          </Pressable>
          <Pressable style={styles.stepper} onPress={increment} accessibilityLabel="Ajouter une unité">
            <Text style={styles.stepperLabel}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => onToggleFavorite(product.id)}
        hitSlop={12} // agrandit la zone tactile sans changer la taille visuelle
        accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Text style={styles.favorite}>{isFavorite ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth, // la ligne la plus fine affichable : sépare la carte du fond
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    thumbnail: {
      width: 64,
      height: 64,
      borderRadius: radius.sm,
    },
    body: {
      flex: 1, // prend toute la largeur restante entre l'image et l'étoile
      gap: spacing.xs,
    },
    brand: {
      ...typography.overline,
      color: colors.textMuted,
    },
    name: {
      ...typography.bodyStrong,
      color: colors.text,
    },
    category: {
      ...typography.caption,
      color: colors.textMuted,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    stepper: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperLabel: {
      ...typography.heading,
      color: colors.primary,
    },
    favorite: {
      ...typography.heading,
      color: colors.favorite,
    },
  });
