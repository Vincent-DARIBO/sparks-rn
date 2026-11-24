import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { hiddenFromScreenReader } from '@/shared/accessibility/hiddenFromScreenReader';
import { useThemedStyles, type Theme } from '@/theme';
import useProductCard from '../hooks/useProductCard';
import { categoryLabels, MAX_QUANTITY, type Product } from '../types';
import ProductThumbnail from './ProductThumbnail';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  /** Boutons − / + : les données du stock appartiennent au parent. */
  onAdjustQuantity: (id: string, delta: number) => void;
  /** Appui sur la carte : ouvre la fiche produit. */
  onPress: (id: string) => void;
  /** Absent = carte non supprimable : l'action « Supprimer » du lecteur d'écran n'est pas proposée. */
  onDelete?: (id: string) => void;
}

/**
 * Carte produit.
 *
 * - AUCUN état local, pas même un `useRef` : FlashList recycle les cellules,
 *   un état local suivrait la cellule et non le produit. La carte affiche
 *   `product.quantity` (données du serveur) et signale les changements au parent.
 *   Le badge de stock, lui, se souvient de la quantité précédente pour « pulser » :
 *   il la mémorise AVEC l'id du produit, ce qui distingue un recyclage d'un vrai changement.
 * - Les FAVORIS : la carte lit elle-même SON étoile dans le store Zustand (sélecteur
 *   `useIsFavorite`). Parmi les cartes, seule celle dont l'étoile change se re-rend.
 *   Le profiler montrait l'inverse quand la carte lisait TOUT le store
 *   (`const { favoriteIds } = useFavoritesStore()`) : sans sélecteur, le hook renvoie l'état
 *   entier du store, un nouvel objet à chaque modification, donc CHAQUE carte se re-rendait
 *   (« Hooks changed ») à chaque changement du store. Avec un sélecteur, la carte ne se re-rend
 *   que si la valeur renvoyée change : ici un booléen, qui ne bouge pas quand on touche
 *   l'étoile d'un AUTRE produit.
 * - `memo` : la carte n'est rendue à nouveau que si ses props changent. Il ne sert à rien
 *   si une prop change à chaque rendu : voir `onPress` dans `useCatalogRoute`.
 *   (avec React Compiler activé, ce `memo` deviendrait superflu).
 */
export default memo(function ProductCard(props: ProductCardProps) {
  const { product, onAdjustQuantity, onPress, onDelete } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { status, isFavorite, toggleFavorite, accessibilityLabel, accessibilityActions, handleAccessibilityAction } =
    useProductCard({ product, onAdjustQuantity, onPress, onDelete });

  return (
    // Accessibilité : `accessible` regroupe la carte en UN seul élément, lu en une phrase.
    // `onAccessibilityTap` : sur iOS, le double appui de VoiceOver n'envoie pas l'action `activate`, il appelle ce rappel.
    // Ses actions remplacent les petits boutons, que les `hiddenFromScreenReader` ci-dessous
    // retirent du parcours du lecteur d'écran (iOS ET Android). Au doigt, rien ne change.
    <View
      style={styles.card}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Ouvre la fiche produit"
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={handleAccessibilityAction}
      onAccessibilityTap={() => onPress(product.id)}
    >
      <View style={styles.main} {...hiddenFromScreenReader}>
        {/*
          Seule la zone d'information ouvre la fiche. On n'imbrique pas les boutons
          −, + et ★ dans ce Pressable : un bouton désactivé (− à 0) laisserait
          l'appui remonter au parent et ouvrirait la fiche.
          `style` peut être une fonction de l'état d'appui : la zone s'enfonce pendant l'appui.
        */}
        <Pressable
          onPress={() => onPress(product.id)}
          style={({ pressed }) => [styles.info, pressed && styles.infoPressed]}
        >
          <ProductThumbnail size={THUMBNAIL_SIZE} photoUri={product.photoUri} />

          <View style={styles.body}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category}>{categoryLabels[product.category]}</Text>
            <StockBadge status={status} quantity={product.quantity} productId={product.id} />
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={styles.stepper}
            onPress={() => onAdjustQuantity(product.id, -1)}
            disabled={product.quantity === 0}
            accessibilityRole="button"
            accessibilityLabel="Retirer une unité"
          >
            <Text style={styles.stepperLabel} maxFontSizeMultiplier={STEPPER_MAX_FONT_SCALE}>
              −
            </Text>
          </Pressable>
          <Pressable
            style={styles.stepper}
            onPress={() => onAdjustQuantity(product.id, 1)}
            disabled={product.quantity >= MAX_QUANTITY}
            accessibilityRole="button"
            accessibilityLabel="Ajouter une unité"
          >
            <Text style={styles.stepperLabel} maxFontSizeMultiplier={STEPPER_MAX_FONT_SCALE}>
              +
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => toggleFavorite(product.id)}
        hitSlop={12} // agrandit la zone tactile sans changer la taille visuelle : 24 + 12 + 12 = 48 pt
        {...hiddenFromScreenReader}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={24} color={theme.colors.favorite} />
      </Pressable>
    </View>
  );
});

const THUMBNAIL_SIZE = 64;
// Le glyphe doit rester dans son cercle de 44 pt : au-delà de 1,3 il serait rogné.
const STEPPER_MAX_FONT_SCALE = 1.3;

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
    // 44 × 44 : la taille minimale recommandée (Apple et Google) pour une zone tactile.
    stepper: {
      width: 44,
      height: 44,
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
