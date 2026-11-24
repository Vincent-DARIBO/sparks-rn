import { StyleSheet, Text, View } from 'react-native';

import type { StockStatus } from '../types/product';

interface StockBadgeProps {
  status: StockStatus;
  quantity: number;
}

/**
 * `Record<StockStatus, …>` : si on ajoute un statut au type StockStatus,
 * TypeScript signale ici qu'il manque sa configuration. Exhaustivité garantie.
 */
const badgeConfig: Record<StockStatus, { label: string; color: string }> = {
  out: { label: 'Rupture', color: '#D93025' },
  low: { label: 'Stock bas', color: '#E37400' },
  ok: { label: 'En stock', color: '#188038' },
};

export default function StockBadge(props: StockBadgeProps) {
  const { status, quantity } = props;
  const { label, color } = badgeConfig[status];

  return (
    // Tableau de styles : le style statique, puis la partie dynamique.
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.label}>
        {label} · {quantity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', // le badge prend la largeur de son contenu
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
