import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from '@/shared/components/BackButton';
import Header from '@/shared/components/Header';
import usePopOnChange from '@/shared/hooks/usePopOnChange';
import InfoRow from '../components/InfoRow';
import LocationRow from '../components/LocationRow';
import ProductHero from '../components/ProductHero';
import StockBadge from '../components/StockBadge';
import useProductQuantity from '../hooks/useProductQuantity';
import { useThemedStyles, type Theme } from '@/theme';
import { MAX_QUANTITY, type Product, type ProductLocation } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onBack: () => void;
  /** Élément affiché à droite de l'en-tête : la route y place le bouton « Modifier ». */
  headerRight?: ReactNode;
  onChoosePhoto: () => void;
  isSavingPhoto: boolean;
  onRecordLocation: () => void;
  onOpenLocation: (location: ProductLocation) => void;
  isLocating: boolean;
}

/**
 * Fiche produit.
 *
 * La quantité vient des données du serveur, partagées avec le catalogue :
 * la carte et la fiche affichent toujours la même valeur.
 */
export default function ProductDetailScreen(props: ProductDetailScreenProps) {
  const {
    product,
    isFavorite,
    onToggleFavorite,
    onAdjustQuantity,
    onBack,
    headerRight,
    onChoosePhoto,
    isSavingPhoto,
    onRecordLocation,
    onOpenLocation,
    isLocating,
  } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { quantity, status, increment, decrement, reset } = useProductQuantity(product, onAdjustQuantity);
  // Le grand nombre pulse plus fort (1.3) que le badge (1.15 par défaut).
  const quantityPopStyle = usePopOnChange(quantity, product.id, 1.3);
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
        left={<BackButton onPress={onBack} />}
        right={headerRight}
      />

      <ScrollView contentContainerStyle={[styles.content, sidePadding]}>
        <ProductHero product={product} isSavingPhoto={isSavingPhoto} onChoosePhoto={onChoosePhoto} />

        {/*
          Animations d'ENTRÉE : jouées une fois, au montage de la fiche (ouverture, lien profond),
          pas à chaque nouveau rendu ni au retour de l'application au premier plan.
          FadeInDown : opacité 0 → 1 et léger glissement vers le haut (25 px → 0), sur le thread UI.
          `delay` décale la seconde section : elles apparaissent l'une après l'autre.
          Une transformation ne change pas la mise en page : la place des sections est réservée d'emblée.
        */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.section}>
          <InfoRow label={t('product.category')} value={t(`categories.${product.category}`)} />
          <InfoRow label={t('product.barcode')} value={product.barcode} />
          <InfoRow label={t('product.threshold')} value={t('stock.units', { count: product.minQuantity })} />
          <LocationRow
            location={product.location}
            isLocating={isLocating}
            onRecordLocation={onRecordLocation}
            onOpenLocation={onOpenLocation}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={[styles.section, styles.stockSection]}>
          <Text style={styles.sectionTitle}>{t('product.stock')}</Text>
          <StockBadge status={status} quantity={quantity} productId={product.id} />
          <View style={styles.stockRow}>
            <Pressable
              style={styles.stepper}
              onPress={decrement}
              disabled={quantity === 0}
              accessibilityLabel={t('product.removeUnit')}
            >
              <Text style={styles.stepperLabel}>−</Text>
            </Pressable>
            <Animated.Text
              // Identifiant stable pour le scénario Maestro : le nombre seul est ambigu.
              testID="product-quantity"
              style={[styles.quantity, quantityPopStyle]}
            >
              {quantity}
            </Animated.Text>
            <Pressable
              style={styles.stepper}
              onPress={increment}
              disabled={quantity >= MAX_QUANTITY}
              accessibilityLabel={t('product.addUnit')}
            >
              <Text style={styles.stepperLabel}>+</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/*
        Hors de la ScrollView : la barre reste fixe en bas. La fiche est une route de la pile,
        affichée par-dessus les onglets : c'est à elle de s'écarter de la barre d'accueil iOS.
      */}
      <View style={[styles.actionBar, sidePadding, { paddingBottom: theme.spacing.md + insets.bottom }]}>
        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={reset}>
          <Text style={[styles.buttonLabel, styles.buttonLabelSecondary]}>{t('common.cancel')}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => onToggleFavorite(product.id)}>
          <Text style={styles.buttonLabel}>{isFavorite ? t('product.favorite') : t('product.makeFavorite')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingVertical: spacing.lg, gap: spacing.lg },
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
