import { StyleSheet, Switch, Text, View } from 'react-native';

import StatTile from '@/shared/components/StatTile';
import { useThemedStyles, type Theme } from '@/theme';

interface CatalogListHeaderProps {
  stats: { total: number; low: number; out: number };
  isLargeDataset: boolean;
  onToggleLargeDataset: (value: boolean) => void;
}

/** En-tête de la liste : statistiques, démo de performances, titre de section. */
export default function CatalogListHeader(props: CatalogListHeaderProps) {
  const { stats, isLargeDataset, onToggleLargeDataset } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.listHeader}>
      <View style={styles.statsRow}>
        <StatTile label="Produits" value={stats.total} />
        <StatTile label="Stock bas" value={stats.low} tone="warning" />
        <StatTile label="Ruptures" value={stats.out} tone="danger" />
      </View>
      {/* Réservé au développement : __DEV__ vaut false dans un build de production. */}
      {__DEV__ ? (
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>Démo perfs : 5 000 produits</Text>
          <Switch value={isLargeDataset} onValueChange={onToggleLargeDataset} />
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>Catalogue</Text>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    listHeader: {
      // Avec la bande sous les filtres (spacing.sm), l'écart total reste spacing.lg.
      paddingTop: spacing.lg - spacing.sm,
      paddingBottom: spacing.md, // espace avant la première rangée de cartes
      gap: spacing.lg,
    },
    statsRow: {
      flexDirection: 'row', // ⚠️ en React Native, la direction par défaut est 'column'
      gap: spacing.md,
    },
    devRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    devLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
    sectionTitle: {
      ...typography.heading,
      color: colors.text,
    },
  });
