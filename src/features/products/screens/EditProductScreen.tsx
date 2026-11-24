import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import ProductForm from '../components/ProductForm';
import ProductFormHeader from '../components/ProductFormHeader';
import useProductForm from '../hooks/useProductForm';
import type { ProductFormValues } from '../types';

interface EditProductScreenProps {
  defaultValues: ProductFormValues;
  onSave: (values: ProductFormValues) => void;
  onCancel: () => void;
}

/**
 * Modale « Modifier le produit » : l'en-tête porte « Enregistrer », le corps porte les champs.
 * Les deux partagent le même formulaire : `useProductForm` est donc appelé ici, au-dessus d'eux.
 */
export default function EditProductScreen(props: EditProductScreenProps) {
  const { defaultValues, onSave, onCancel } = props;
  const { styles } = useThemedStyles(createStyles);
  const { control, submit } = useProductForm({ defaultValues, onSubmit: onSave });

  return (
    <View style={styles.screen}>
      <ProductFormHeader title="Modifier le produit" onCancel={onCancel} onSubmit={submit} />
      <ProductForm control={control} />
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
  });
