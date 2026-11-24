import type { DefaultValues } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import useProductForm from '../hooks/useProductForm';
import type { ProductFormValues } from '../schema';
import ProductFormFields from './ProductFormFields';
import ProductFormHeader from './ProductFormHeader';

interface ProductFormProps {
  /** « Nouveau produit » ou « Modifier le produit » : seul le titre change. */
  title: string;
  defaultValues: DefaultValues<ProductFormValues>;
  /** Appelé seulement si TOUTES les règles du schéma sont respectées ; attendu jusqu'à la réponse du serveur. */
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

/**
 * Formulaire produit en modale, partagé par la création et la modification.
 * L'en-tête porte « Enregistrer », le corps porte les champs : les deux partagent
 * le même formulaire, `useProductForm` est donc appelé ici, au-dessus d'eux.
 */
export default function ProductForm(props: ProductFormProps) {
  const { title, defaultValues, onSubmit, onCancel } = props;
  const { styles } = useThemedStyles(createStyles);
  const { control, submit, isSubmitting } = useProductForm({ defaultValues, onSubmit });

  return (
    <View style={styles.screen}>
      <ProductFormHeader title={title} onCancel={onCancel} onSubmit={submit} isSubmitting={isSubmitting} />
      <ProductFormFields control={control} />
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
  });
