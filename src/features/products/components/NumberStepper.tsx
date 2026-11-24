import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Message d'erreur affiché sous le compteur (absent = pas d'erreur). */
  error?: string;
}

/**
 * Compteur − / + de la maquette (Quantité, Seuil d'alerte).
 * Composant CONTRÔLÉ : il affiche `value` et signale les changements par `onChange`,
 * exactement l'interface attendue par le `Controller` de React Hook Form.
 * « − » est désactivé à 0 : la valeur n'est jamais négative.
 */
export default function NumberStepper(props: NumberStepperProps) {
  const { label, value, onChange, error } = props;
  const { styles } = useThemedStyles(createStyles);
  const isAtMinimum = value <= 0;

  return (
    <View style={[styles.box, error ? styles.boxError : null]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, isAtMinimum && styles.disabled]}
          onPress={() => onChange(value - 1)}
          disabled={isAtMinimum}
          accessibilityRole="button"
          accessibilityLabel={`Diminuer : ${label}`}
          accessibilityState={{ disabled: isAtMinimum }}
        >
          <Text style={styles.buttonLabel}>−</Text>
        </Pressable>
        <Text style={styles.value} accessibilityLabel={`${label} : ${value}`}>
          {value}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => onChange(value + 1)}
          accessibilityRole="button"
          accessibilityLabel={`Augmenter : ${label}`}
        >
          <Text style={styles.buttonLabel}>+</Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    box: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      alignItems: 'center',
      gap: spacing.sm,
    },
    // Seule la couleur change : même épaisseur qu'au repos, rien ne bouge quand l'erreur apparaît.
    boxError: { borderColor: colors.danger },
    label: { fontSize: 14, fontWeight: '600', color: colors.text },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    // 44 × 44 : la taille minimale recommandée pour une cible tactile.
    button: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabled: { opacity: 0.4 },
    buttonLabel: { fontSize: 22, fontWeight: '600', color: colors.primary },
    value: { minWidth: 36, textAlign: 'center', fontSize: 22, fontWeight: '700', color: colors.text },
    error: { fontSize: 13, color: colors.danger, textAlign: 'center' },
  });
