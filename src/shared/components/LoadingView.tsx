import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface LoadingViewProps {
  /** En-tête affiché au-dessus de l'indicateur (fourni par la route). */
  header?: ReactNode;
}

/** Indicateur de chargement plein écran (premier chargement d'une requête). */
export default function LoadingView(props: LoadingViewProps) {
  const { header } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      {header}
      <View style={styles.body}>
        <ActivityIndicator size="large" color={theme.colors.primary} accessibilityLabel={t('common.loading')} />
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
