import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface SettingsRowProps {
  label: string;
  /** Contenu à droite : un interrupteur, une valeur… */
  children: ReactNode;
  /** Trait de séparation sous la ligne (toutes sauf la dernière de la carte). */
  hasSeparator?: boolean;
}

/** Ligne de réglage : libellé à gauche, contrôle ou valeur à droite. */
export default function SettingsRow(props: SettingsRowProps) {
  const { label, children, hasSeparator = false } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={[styles.row, hasSeparator && styles.separator]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    row: {
      minHeight: 52, // au-dessus des 44 pt minimum : toute la ligne reste confortable au doigt
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm, // quand la ligne passe sur deux lignes, le contenu ne touche pas les bords
      flexDirection: 'row',
      flexWrap: 'wrap', // très grand texte : la valeur ou le contrôle passe sous le libellé
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    separator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    control: { marginLeft: 'auto', flexShrink: 1, alignItems: 'flex-end' }, // reste à droite, même sur la 2e ligne
    label: { ...typography.body, color: colors.text, flexShrink: 1 },
  });
