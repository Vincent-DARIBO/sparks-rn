import { useLocalSearchParams, useRouter } from 'expo-router';

import { getUserMessage } from '@/shared/errors/getUserMessage';
import { isNotFoundError } from '@/shared/errors/isNotFoundError';

import type { ProductFormValues } from '../schema';
import type { Product } from '../types';
import useProduct from './useProduct';
import useUpdateProduct from './useUpdateProduct';

// On sépare l'identifiant (non modifiable) des champs du formulaire.
// Photo et emplacement ne sont pas non plus des champs du formulaire : on les écarte, ils restent
// sur le serveur (le PATCH n'envoie que les champs du formulaire).
function toFormValues({
  id: _productId,
  photoUri: _photoUri,
  location: _location,
  ...formValues
}: Product): ProductFormValues {
  return formValues;
}

/** Logique de la modale `/product/[id]/edit` : produit à modifier, annuler, enregistrer. */
export default function useProductEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, errorProduct, refetchProduct, isRefetchingProduct } = useProduct(id);
  const { updateProduct } = useUpdateProduct(id);

  // Fermer la modale = revenir à l'écran du dessous (la fiche), sans rien enregistrer.
  const cancel = () => router.back();

  const save = async (values: ProductFormValues) => {
    try {
      // La modale ne se ferme qu'APRÈS la réponse du serveur, et seulement en cas de succès.
      await updateProduct(values);
    } catch {
      // Échec déjà signalé par l'alerte globale : la modale reste ouverte, avec la saisie.
      return;
    }
    // Navigation HORS du try : une erreur de navigation ne doit pas être prise pour un échec d'enregistrement.
    router.back();
  };

  return {
    id,
    defaultValues: product ? toFormValues(product) : undefined,
    isProductNotFound: isNotFoundError(errorProduct),
    errorMessage: errorProduct ? getUserMessage(errorProduct) : null,
    refetchProduct,
    isRefetchingProduct,
    cancel,
    save,
  };
}
