import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, Text, View } from 'react-native';

import useFormatters from '@/i18n/useFormatters';
import StatTile from '@/shared/components/StatTile';
import { useThemedStyles, type Theme } from '@/theme';

import { LARGE_DATASET_SIZE } from '../types';

interface CatalogListHeaderProps {
  stats: { total: number; low: number; out: number };
  isLargeDataset: boolean;
  onToggleLargeDataset: (value: boolean) => void;
}

/** En-tête de la liste : statistiques, démo de performances, titre de section. */
export default function CatalogListHeader(props: CatalogListHeaderProps) {
  const { stats, isLargeDataset, onToggleLargeDataset } = props;
  const { styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();
  // Nombres au format de la langue : « 5 000 » en français, « 5,000 » en anglais.
  const format = useFormatters();

  return (
    <View style={styles.listHeader}>
      <View style={styles.statsRow}>
        <StatTile label={t('catalog.statProducts')} value={format.number(stats.total)} />
        <StatTile label={t('catalog.statLow')} value={format.number(stats.low)} tone="warning" />
        <StatTile label={t('catalog.statOut')} value={format.number(stats.out)} tone="danger" />
      </View>
      {/* Réservé au développement : __DEV__ vaut false dans un build de production. */}
      {__DEV__ ? (
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>{t('catalog.perfDemo', { total: format.number(LARGE_DATASET_SIZE) })}</Text>
          <Switch value={isLargeDataset} onValueChange={onToggleLargeDataset} />
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>{t('catalog.title')}</Text>
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
