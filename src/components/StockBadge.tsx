import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type ColorTokens, type Theme } from '../theme';
import type { StockStatus } from '../types/product';

interface StockBadgeProps {
  status: StockStatus;
  quantity: number;
}

/**
 * `Record<StockStatus, …>` : si on ajoute un statut au type StockStatus,
 * TypeScript signale ici qu'il manque sa configuration. Exhaustivité garantie.
 * Le statut est associé à un NOM de couleur du thème, pas à une valeur :
 * le badge s'adapte automatiquement au mode sombre.
 */
const badgeConfig: Record<StockStatus, { label: string; color: keyof ColorTokens }> = {
  out: { label: 'Rupture', color: 'danger' },
  low: { label: 'Stock bas', color: 'warning' },
  ok: { label: 'En stock', color: 'success' },
};

export default function StockBadge(props: StockBadgeProps) {
  const { status, quantity } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { label, color } = badgeConfig[status];

  return (
    // Tableau de styles : le style statique, puis la partie dynamique.
    <View style={[styles.badge, { backgroundColor: theme.colors[color] }]}>
      <Text style={styles.label}>
        {label} · {quantity}
      </Text>
    </View>
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
