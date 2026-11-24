import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import useUpdateStatus from '../hooks/useUpdateStatus';
import SettingsRow from './SettingsRow';

/** Ligne « Mise à jour » et, sous elle, le bouton qui recherche, télécharge ou applique une mise à jour. */
export default function UpdateStatus() {
  const { theme, styles } = useThemedStyles(createStyles);
  const { isUpdatesEnabled, statusLabel, actionLabel, isBusy, runAction } = useUpdateStatus();

  return (
    <>
      <SettingsRow label="Mise à jour" hasSeparator={isUpdatesEnabled}>
        <Text style={styles.valueText}>{statusLabel}</Text>
      </SettingsRow>
      {isUpdatesEnabled ? (
        <Pressable
          onPress={runAction}
          disabled={isBusy}
          accessibilityRole="button"
          accessibilityState={{ disabled: isBusy, busy: isBusy }}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          {isBusy ? <ActivityIndicator color={theme.colors.primary} /> : null}
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    valueText: { ...typography.body, color: colors.textMuted },
    action: {
      minHeight: 52, // même hauteur qu'une ligne de réglage, au-dessus des 44 pt minimum
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    pressed: { opacity: 0.7 },
    actionText: { ...typography.body, color: colors.primary },
  });
