import { useRouter } from 'expo-router';

import type { ProductFormValues } from '../schema';
import useInventoryContext from './useInventoryContext';

// Pas de catégorie par défaut : l'utilisateur DOIT en choisir une.
const NEW_PRODUCT_DEFAULTS = { name: '', brand: '', barcode: '', quantity: 0, minQuantity: 5 };

/** Logique de la modale `/product/new` : valeurs de départ, annuler, créer. */
export default function useNewProductRoute() {
  const router = useRouter();
  const { addProduct } = useInventoryContext();

  const cancel = () => router.back();

  const submit = (values: ProductFormValues) => {
    const id = addProduct(values);
    // `push` empilerait la fiche PAR-DESSUS le formulaire : le retour rouvrirait le formulaire.
    // `replace` REMPLACE la modale par la fiche dans l'historique : le retour mène au catalogue.
    router.replace({ pathname: '/product/[id]', params: { id } });
  };

  return { defaultValues: NEW_PRODUCT_DEFAULTS, cancel, submit };
}
