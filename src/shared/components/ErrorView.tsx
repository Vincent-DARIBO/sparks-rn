import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
  /** Vrai pendant le nouvel essai : bouton désactivé et indicateur d'activité. */
  isRetrying?: boolean;
  /** Bandeau au-dessus de données déjà affichées, au lieu d'un écran complet. */
  compact?: boolean;
  /** En-tête affiché au-dessus de l'erreur plein écran (fourni par la route). */
  header?: ReactNode;
}

/** Erreur : message clair et bouton « Réessayer », en plein écran ou en bandeau. */
export default function ErrorView(props: ErrorViewProps) {
  const { message, onRetry, isRetrying = false, compact = false, header } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const content = (
    <View style={compact ? styles.banner : styles.body}>
      {/*
        role « alert » : le lecteur d'écran présente ce texte comme une alerte.
        accessibilityLiveRegion (Android uniquement) : TalkBack annonce le message quand il change.
        iOS n'a pas d'équivalent sur un Text : VoiceOver le lit quand on le parcourt.
      */}
      <Text
        style={[styles.message, compact && styles.messageCompact]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        disabled={isRetrying}
        accessibilityRole="button"
        accessibilityState={{ disabled: isRetrying, busy: isRetrying }}
        style={({ pressed }) => [
          styles.button,
          compact && styles.buttonCompact,
          (pressed || isRetrying) && styles.buttonDimmed,
        ]}
      >
        {isRetrying ? <ActivityIndicator size="small" color={theme.colors.onPrimary} /> : null}
        <Text style={styles.buttonLabel}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );

  if (compact) return content;

  return (
    <View style={styles.screen}>
      {header}
      {content}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.danger,
    },
    message: { ...typography.body, color: colors.text, textAlign: 'center' },
    messageCompact: { ...typography.caption, flex: 1, textAlign: 'left' },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    buttonCompact: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    buttonDimmed: { opacity: 0.7 },
    buttonLabel: { ...typography.bodyStrong, color: colors.onPrimary },
  });
