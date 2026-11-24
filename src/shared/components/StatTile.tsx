import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type ColorTokens, type Theme } from '@/theme';

interface StatTileProps {
  label: string;
  value: number;
  /** Couleur sémantique de la valeur (par défaut : texte principal). */
  tone?: keyof ColorTokens;
}

/** Tuile de chiffre clé affichée sur l'écran d'accueil. */
export default function StatTile(props: StatTileProps) {
  const { label, value, tone = 'text' } = props;
  const { theme, styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.tile}>
      <Text style={[styles.value, { color: theme.colors[tone] }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    tile: {
      flex: 1, // les tuiles d'une même ligne se partagent la largeur à parts égales
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
    },
    value: {
      fontSize: 24,
      fontWeight: '700',
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
  });
