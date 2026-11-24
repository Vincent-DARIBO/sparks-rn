import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import { categoryLabels, type Category } from '../types';

interface CategoryChipsProps {
  value: Category | null;
  onChange: (category: Category | null) => void;
  /** Ajoute la pastille « Tous » (filtres du catalogue). `false` dans le formulaire. */
  includeAll?: boolean;
  /** `scroll` : une rangée qui défile (catalogue) ; `wrap` : retour à la ligne (formulaire). */
  layout?: 'scroll' | 'wrap';
}

/** `Object.keys` renvoie `string[]` : on reprécise le type des clés. */
const categories = Object.keys(categoryLabels) as Category[];

/** Une pastille par catégorie, calculées une seule fois. */
const categoryOptions: { key: Category | null; label: string }[] = categories.map((c) => ({
  key: c,
  label: categoryLabels[c],
}));

/** « Tous » (`null`) en tête, pour les filtres du catalogue. */
const optionsWithAll = [{ key: null, label: 'Tous' }, ...categoryOptions];

/** Pastilles de catégorie : filtres du catalogue et choix dans le formulaire. */
export default function CategoryChips(props: CategoryChipsProps) {
  const { value, onChange, includeAll = true, layout = 'scroll' } = props;
  const { styles } = useThemedStyles(createStyles);
  const options = includeAll ? optionsWithAll : categoryOptions;

  const chips = options.map((option) => {
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
  });

  if (layout === 'wrap') {
    return <View style={[styles.row, styles.wrap]}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      // Un appui sur une pastille fonctionne du premier coup, même clavier ouvert.
      keyboardShouldPersistTaps="handled"
    >
      {chips}
    </ScrollView>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    row: { gap: spacing.sm },
    wrap: { flexDirection: 'row', flexWrap: 'wrap' },
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
