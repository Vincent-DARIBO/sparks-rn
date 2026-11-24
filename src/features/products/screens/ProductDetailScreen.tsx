import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/shared/components/Header';
import InfoRow from '../components/InfoRow';
import ProductThumbnail from '../components/ProductThumbnail';
import StockBadge from '../components/StockBadge';
import useProductQuantity from '../hooks/useProductQuantity';
import { useThemedStyles, type Theme } from '@/theme';
import { categoryLabels, type Product } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onBack: () => void;
  /** Élément affiché à droite de l'en-tête : la route y place le bouton « Modifier ». */
  headerRight?: ReactNode;
}

/**
 * Fiche produit.
 *
 * La quantité vient de l'inventaire partagé (useInventory) : une modification
 * faite ici se voit sur la carte du catalogue, et inversement.
 * La limite acceptée au Jour 1 (état local useStock) est levée.
 */
export default function ProductDetailScreen(props: ProductDetailScreenProps) {
  const { product, isFavorite, onToggleFavorite, onAdjustQuantity, onBack, headerRight } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { quantity, status, increment, decrement, reset } = useProductQuantity(product, onAdjustQuantity);
  // En paysage, l'encoche passe sur un côté : contenu et barre d'actions s'en écartent.
  const sidePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
  };

  return (
    <View style={styles.screen}>
      <Header
        title={product.name}
        subtitle={product.brand}
        left={
          <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Retour au catalogue">
            <Text style={styles.back}>‹</Text>
          </Pressable>
        }
        right={headerRight}
      />

      <ScrollView contentContainerStyle={[styles.content, sidePadding]}>
        {/* Visuel : aspectRatio fixe la proportion, la largeur s'adapte à l'écran */}
        <View style={styles.hero}>
          <ProductThumbnail size={96} />
        </View>

        <View style={styles.section}>
          <InfoRow label="Catégorie" value={categoryLabels[product.category]} />
          <InfoRow label="Code-barres" value={product.barcode} />
          <InfoRow label="Seuil d'alerte" value={`${product.minQuantity} unités`} />
        </View>

        <View style={[styles.section, styles.stockSection]}>
          <Text style={styles.sectionTitle}>Stock</Text>
          <StockBadge status={status} quantity={quantity} />
          <View style={styles.stockRow}>
            <Pressable
              style={styles.stepper}
              onPress={decrement}
              disabled={quantity === 0}
              accessibilityLabel="Retirer une unité"
            >
              <Text style={styles.stepperLabel}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable style={styles.stepper} onPress={increment} accessibilityLabel="Ajouter une unité">
              <Text style={styles.stepperLabel}>+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/*
        Hors de la ScrollView : la barre reste fixe en bas. La fiche est une route de la pile,
        affichée par-dessus les onglets : c'est à elle de s'écarter de la barre d'accueil iOS.
      */}
      <View style={[styles.actionBar, sidePadding, { paddingBottom: theme.spacing.md + insets.bottom }]}>
        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={reset}>
          <Text style={[styles.buttonLabel, styles.buttonLabelSecondary]}>Annuler</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => onToggleFavorite(product.id)}>
          <Text style={styles.buttonLabel}>{isFavorite ? '★ Favori' : '☆ Ajouter aux favoris'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    back: { fontSize: 36, lineHeight: 36, color: colors.onHeader },
    content: { paddingVertical: spacing.lg, gap: spacing.lg },
    hero: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.md,
    },
    stockSection: { alignItems: 'center' },
    sectionTitle: { ...typography.heading, color: colors.text },
    stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
    stepper: {
      width: 48,
      height: 48,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperLabel: { fontSize: 24, fontWeight: '600', color: colors.primary },
    quantity: { fontSize: 40, fontWeight: '700', color: colors.text, minWidth: 64, textAlign: 'center' },
    actionBar: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingTop: spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
    buttonLabel: { ...typography.bodyStrong, color: colors.onPrimary },
    buttonLabelSecondary: { color: colors.primary },
  });
