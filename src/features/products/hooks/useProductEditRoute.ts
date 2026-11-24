import { useLocalSearchParams, useRouter } from 'expo-router';

import type { Product, ProductFormValues } from '../types';
import useInventoryContext from './useInventoryContext';

// On sépare l'identifiant (non modifiable) des champs du formulaire.
function toFormValues({ id: _productId, ...formValues }: Product): ProductFormValues {
  return formValues;
}

/** Logique de la modale `/product/[id]/edit` : produit à modifier, annuler, enregistrer. */
export default function useProductEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products, updateProduct } = useInventoryContext();

  const product = products.find((p) => p.id === id);
  // Fermer la modale = revenir à l'écran du dessous (la fiche), sans rien enregistrer.
  const cancel = () => router.back();

  const save = (values: ProductFormValues) => {
    if (!product) return;
    updateProduct(product.id, values);
    // La fiche et le catalogue lisent le même inventaire : ils affichent déjà les nouvelles valeurs.
    router.back();
  };

  const defaultValues = product ? toFormValues(product) : undefined;

  return { id, defaultValues, cancel, save };
}
