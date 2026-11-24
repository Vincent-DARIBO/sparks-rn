import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';
import { categoryLabels, MAX_QUANTITY, type Product } from '../types';
import { getStockStatus } from '../utils/stock';
import ProductThumbnail from './ProductThumbnail';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  /** Callback remonté au parent : c'est lui qui possède l'état des favoris. */
  onToggleFavorite: (id: string) => void;
  /** Boutons − / + : les données du stock appartiennent au parent. */
  onAdjustQuantity: (id: string, delta: number) => void;
  /** Appui sur la carte : ouvre la fiche produit. */
  onPress: (id: string) => void;
}

/**
 * Carte produit.
 *
 * - AUCUN état local, pas même un `useRef` : FlashList recycle les cellules,
 *   un état local suivrait la cellule et non le produit. La carte affiche
 *   `product.quantity` (données du serveur) et signale les changements au parent.
 * - Les FAVORIS sont un état du parent (App) : valeur en props, changement par callback.
 *   → Les données descendent, les événements remontent.
 * - `memo` : la carte n'est rendue à nouveau que si ses props changent
 *   (avec React Compiler activé, ce `memo` deviendrait superflu).
 */
export default memo(function ProductCard(props: ProductCardProps) {
  const { product, isFavorite, onToggleFavorite, onAdjustQuantity, onPress } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const status = getStockStatus(product.quantity, product.minQuantity);

  return (
    <View style={styles.card}>
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
          <ProductThumbnail size={THUMBNAIL_SIZE} />

          <View style={styles.body}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category}>{categoryLabels[product.category]}</Text>
            <StockBadge status={status} quantity={product.quantity} />
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={styles.stepper}
            onPress={() => onAdjustQuantity(product.id, -1)}
            disabled={product.quantity === 0}
            accessibilityLabel="Retirer une unité"
          >
            <Text style={styles.stepperLabel}>−</Text>
          </Pressable>
          <Pressable
            style={styles.stepper}
            onPress={() => onAdjustQuantity(product.id, 1)}
            disabled={product.quantity >= MAX_QUANTITY}
            accessibilityLabel="Ajouter une unité"
          >
            <Text style={styles.stepperLabel}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => onToggleFavorite(product.id)}
        hitSlop={12} // agrandit la zone tactile sans changer la taille visuelle
        accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={24} color={theme.colors.favorite} />
      </Pressable>
    </View>
  );
});

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
  });
