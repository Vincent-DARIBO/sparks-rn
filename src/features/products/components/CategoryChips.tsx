import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import { categoryLabels, type Category } from '../types';

interface CategoryChipsProps {
  value: Category | null;
  onChange: (category: Category | null) => void;
}

/** `Object.keys` renvoie `string[]` : on reprécise le type des clés. */
const categories = Object.keys(categoryLabels) as Category[];

/** « Tous » (`null`) puis une pastille par catégorie, calculées une seule fois. */
const options: { key: Category | null; label: string }[] = [
  { key: null, label: 'Tous' },
  ...categories.map((c) => ({ key: c, label: categoryLabels[c] })),
];

/** Filtres par catégorie : une rangée de pastilles qui défile horizontalement. */
export default function CategoryChips(props: CategoryChipsProps) {
  const { value, onChange } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      // Un appui sur une pastille fonctionne du premier coup, même clavier ouvert.
      keyboardShouldPersistTaps="handled"
    >
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.label}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    row: { gap: spacing.sm },
    chip: {
      height: 36,
      paddingHorizontal: 14,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      justifyContent: 'center',
    },
    chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    pressed: { opacity: 0.7 },
    label: { fontSize: 14, fontWeight: '600', color: colors.text },
    labelSelected: { color: colors.onPrimary },
  });
