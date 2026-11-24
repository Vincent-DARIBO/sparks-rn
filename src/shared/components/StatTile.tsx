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
      <Text style={[styles.value, { color: theme.colors[tone] }]} maxFontSizeMultiplier={TILE_MAX_FONT_SCALE}>
        {value}
      </Text>
      <Text style={styles.label} maxFontSizeMultiplier={TILE_MAX_FONT_SCALE}>
        {label}
      </Text>
    </View>
  );
}

// Trois tuiles se partagent la largeur de l'écran : au-delà de 1,3, « Produits » ne tient plus sur une ligne.
const TILE_MAX_FONT_SCALE = 1.3;

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
