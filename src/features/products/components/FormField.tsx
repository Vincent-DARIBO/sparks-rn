import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  /** Message d'erreur affiché sous le champ (absent = pas d'erreur). */
  error?: string;
  // Erreur TypeScript attendue n° 1, le type de `ref` (la n° 2, sur `onPress`, est expliquée
  // dans useProductForm). Elle se règle en deux temps :
  //  - déclarer `ref` : `TextInputProps` ne la contient pas, donc `<FormField ref={ref} />`
  //    serait refusé. En React 19, `ref` se reçoit comme une prop ordinaire (plus de forwardRef) ;
  //  - lui donner le bon type : avec l'API TypeScript stricte de React Native 0.88, `Ref<TextInput>`
  //    ne correspond pas à l'instance que reçoit la ref. `ComponentRef<typeof TextInput>`
  //    demande à TypeScript le type exact de cette instance.
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

/** Champ de formulaire de la maquette : libellé, zone de saisie, message d'erreur. */
export default function FormField(props: FormFieldProps) {
  const { label, error, style, ref, ...inputProps } = props;
  const { theme, styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={theme.colors.textMuted}
        // Le lecteur d'écran annonce le libellé en arrivant sur le champ, puis l'erreur éventuelle.
        accessibilityLabel={label}
        accessibilityHint={error}
        {...inputProps}
      />
      {error ? (
        // Android annonce ce texte dès qu'il apparaît ; sur iOS, il est lu avec le champ (hint).
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    container: { gap: 6 },
    label: { fontSize: 14, fontWeight: '600', color: colors.text },
    input: {
      height: 48,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      fontSize: 16,
      color: colors.text,
    },
    // Seule la couleur change : même épaisseur qu'au repos, rien ne bouge quand l'erreur apparaît.
    inputError: { borderColor: colors.danger },
    error: { fontSize: 13, color: colors.danger },
  });
