import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Choix exclusif entre quelques options (maquette : « Système / Clair / Sombre »).
 * Accessibilité : un groupe de boutons radio, le lecteur d'écran annonce l'option cochée.
 */
export default function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const { label, options, value, onChange } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            style={[styles.segment, isSelected && styles.segmentSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      padding: spacing.xs,
      gap: spacing.xs,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
    },
    segment: {
      flex: 1,
      minHeight: 44, // taille minimale recommandée pour une cible tactile
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm + 2,
    },
    segmentSelected: {
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    label: { ...typography.bodyStrong, fontSize: 15, color: colors.textMuted },
    labelSelected: { color: colors.text },
  });
