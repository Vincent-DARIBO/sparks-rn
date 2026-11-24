import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import useStock from '../hooks/useStock';
import { useThemedStyles, type Theme } from '@/theme';
import { categoryLabels, type Product } from '../types';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  /** Callback remonté au parent : c'est lui qui possède l'état des favoris. */
  onToggleFavorite: (id: string) => void;
  /** Appui sur la carte : ouvre la fiche produit. */
  onPress: (id: string) => void;
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
  const { product, isFavorite, onToggleFavorite, onPress, style } = props;
  const { styles } = useThemedStyles(createStyles);
  const { quantity, status, increment, decrement } = useStock(
    product.quantity,
    product.minQuantity,
  );

  return (
    // Tableau de styles : le style de base, puis celui imposé par le parent.
    <View style={[styles.card, style]}>
      <View style={styles.main}>
        {/*
          Seule la zone d'information ouvre la fiche. On n'imbrique pas les boutons
          −, + et ★ dans ce Pressable : un bouton désactivé (− à 0) laisserait
          l'appui remonter au parent et ouvrirait la fiche, et le lecteur d'écran
          verrait toute la carte comme un seul bouton.
          `style` peut être une fonction de l'état d'appui : la zone s'enfonce pendant l'appui.
        */}
        <Pressable
          onPress={() => onPress(product.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ouvrir la fiche de ${product.name}`}
          style={({ pressed }) => [styles.info, pressed && styles.infoPressed]}
        >
          {/* Image locale provisoire : require() est résolu au moment du build par Metro */}
          <Image source={require('../../../../assets/icon.png')} style={styles.thumbnail} />

          <View style={styles.body}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category}>{categoryLabels[product.category]}</Text>
            <StockBadge status={status} quantity={quantity} />
          </View>
        </Pressable>

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

const THUMBNAIL_SIZE = 64;

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
    main: {
      flex: 1, // prend toute la largeur restante avant l'étoile
      gap: spacing.xs,
    },
    info: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    infoPressed: {
      opacity: 0.7,
    },
    thumbnail: {
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      borderRadius: radius.sm,
    },
    body: {
      flex: 1, // prend toute la largeur restante à droite de l'image
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
      // Décalage de la largeur de l'image : les boutons restent alignés sous le texte.
      marginLeft: THUMBNAIL_SIZE + spacing.md,
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
