import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

/** Largeur à partir de laquelle on passe sur deux colonnes (tablette, paysage). */
const TWO_COLUMNS_BREAKPOINT = 600;

/**
 * Mise en page responsive de l'accueil : safe areas et largeur d'une carte.
 */
export default function useHomeLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // useWindowDimensions se met à jour à la rotation de l'écran
  // (contrairement à Dimensions.get, lu une seule fois).
  const { width } = useWindowDimensions();

  const columns = width >= TWO_COLUMNS_BREAKPOINT ? 2 : 1;
  // Largeur d'une carte = (largeur utile − espaces entre colonnes) / colonnes.
  const horizontalPadding = theme.spacing.lg * 2 + insets.left + insets.right;
  const gap = theme.spacing.md;
  const cardWidth = (width - horizontalPadding - gap * (columns - 1)) / columns;

  return { insets, columns, cardWidth };
}
