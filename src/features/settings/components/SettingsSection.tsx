import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  /** Les lignes sont regroupées dans une carte ; le sélecteur de thème a déjà son propre fond. */
  isCard?: boolean;
}

/** Groupe de réglages : un titre (« Apparence », « Scanner »…) et son contenu. */
export default function SettingsSection(props: SettingsSectionProps) {
  const { title, children, isCard = true } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {isCard ? <View style={styles.card}>{children}</View> : children}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    section: { gap: spacing.sm },
    title: { ...typography.overline, color: colors.textMuted, marginLeft: spacing.xs },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden', // la ligne séparatrice ne déborde pas des coins arrondis
    },
  });
