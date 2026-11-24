import { Controller, type Control } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles, type Theme } from '@/theme';

import type { ProductFormValues } from '../types';
import { sanitizeBarcode } from '../utils/sanitizeBarcode';
import CategoryChips from './CategoryChips';
import FormField from './FormField';
import NumberStepper from './NumberStepper';

interface ProductFormProps {
  /** Fourni par `useProductForm` : relie chaque `Controller` au même formulaire. */
  control: Control<ProductFormValues>;
}

/**
 * Champs du formulaire produit (maquette « Formulaire produit »).
 * En React Native, tous les champs sont contrôlés : `Controller` relie React Hook Form
 * à chaque composant (valeur affichée + fonction appelée à chaque changement).
 */
export default function ProductForm(props: ProductFormProps) {
  const { control } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  // En paysage, l'encoche passe sur un côté : le contenu s'en écarte, comme sur la fiche.
  const safePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
    paddingBottom: theme.spacing.xl + insets.bottom,
  };

  return (
    <>
      {/* Fait défiler le champ actif au-dessus du clavier, sur iOS comme sur Android */}
      <KeyboardAwareScrollView
        // Marge entre le champ actif et le clavier : la barre « précédent / suivant » s'y loge.
        bottomOffset={64}
        contentContainerStyle={[styles.content, safePadding]}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <FormField
              ref={ref}
              label="Nom du produit"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
          )}
        />

        <Controller
          control={control}
          name="brand"
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <FormField
              ref={ref}
              label="Marque"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              returnKeyType="next"
            />
          )}
        />

        <Controller
          control={control}
          name="barcode"
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <FormField
              ref={ref}
              label="Code-barres"
              value={value}
              onChangeText={(text) => onChange(sanitizeBarcode(text))}
              onBlur={onBlur}
              keyboardType="number-pad"
              placeholder="13 chiffres"
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <View style={styles.group}>
              <Text style={styles.groupLabel}>Catégorie</Text>
              <CategoryChips
                value={value}
                // Sans la pastille « Tous », la valeur reçue n'est jamais null.
                onChange={(category) => category && onChange(category)}
                includeAll={false}
                layout="wrap"
              />
            </View>
          )}
        />

        <View style={styles.steppers}>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { value, onChange } }) => (
              <NumberStepper label="Quantité" value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="minQuantity"
            render={({ field: { value, onChange } }) => (
              <NumberStepper label="Seuil d'alerte" value={value} onChange={onChange} />
            )}
          />
        </View>
      </KeyboardAwareScrollView>

      {/*
        Barre au-dessus du clavier : champ précédent / suivant / Terminé.
        Limite connue : dans Expo Go sous Android 14 ou moins, la barre peut rester invisible
        au premier lancement de l'app. Elle fonctionne sur iOS et après recréation de l'écran
        Android (rotation, passage en mode sombre) ; une build de développement ne devrait pas
        être concernée.
      */}
      <KeyboardToolbar>
        <KeyboardToolbar.Prev />
        <KeyboardToolbar.Next />
        <KeyboardToolbar.Done text="Terminé" />
      </KeyboardToolbar>
    </>
  );
}

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    content: { padding: spacing.lg, gap: spacing.lg },
    group: { gap: spacing.sm },
    groupLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
    steppers: { flexDirection: 'row', gap: spacing.md },
  });
