import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import usePopOnChange from '@/shared/hooks/usePopOnChange';
import { useThemedStyles, type ColorTokens, type Theme } from '@/theme';
import type { StockStatus } from '../types';
import { formatUnits } from '../utils/productAccessibility';
import { getStockText, stockStatusLabels } from '../utils/stock';

interface StockBadgeProps {
  status: StockStatus;
  quantity: number;
  // Identifiant du produit : une cellule recyclée (autre produit) ne doit pas pulser.
  // Facultatif, mais SANS lui le badge pulse aussi au recyclage : à fournir dans une liste.
  productId?: string;
}

/**
 * `Record<StockStatus, …>` : si on ajoute un statut au type StockStatus,
 * TypeScript signale ici qu'il manque sa configuration. Exhaustivité garantie.
 * Le statut est associé à un NOM de couleur du thème, pas à une valeur :
 * le badge s'adapte automatiquement au mode sombre.
 */
const badgeColors: Record<StockStatus, keyof ColorTokens> = {
  out: 'danger',
  low: 'warning',
  ok: 'success',
};

const BADGE_MAX_FONT_SCALE = 1.6;

export default function StockBadge(props: StockBadgeProps) {
  const { status, quantity, productId } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const color = badgeColors[status];
  // Le badge « pulse » quand la quantité de CE produit change.
  const popStyle = usePopOnChange(quantity, productId);

  return (
    // Tableau de styles : le style statique, puis la partie dynamique, puis le style animé.
    // `Animated.View` : une View dont le style peut être piloté depuis le thread UI.
    // Lecteur d'écran : « Stock bas, 6 unités » plutôt que « Stock bas point médian 6 ».
    <Animated.View
      style={[styles.badge, { backgroundColor: theme.colors[color] }, popStyle]}
      accessible
      accessibilityLabel={`${stockStatusLabels[status]}, ${formatUnits(quantity)}`}
    >
      {/* Texte agrandi par le système : le badge grandit, mais plafonné pour ne pas casser la carte. */}
      <Text style={styles.label} maxFontSizeMultiplier={BADGE_MAX_FONT_SCALE}>
        {getStockText(status, quantity)}
      </Text>
    </Animated.View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start', // le badge prend la largeur de son contenu
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
    },
    label: {
      ...typography.caption,
      fontWeight: '600',
      color: colors.onStatus,
    },
  });
