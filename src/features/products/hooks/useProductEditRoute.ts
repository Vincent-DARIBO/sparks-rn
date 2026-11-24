import { useLocalSearchParams, useRouter } from 'expo-router';

import { getUserMessage } from '@/shared/errors/getUserMessage';
import { isNotFoundError } from '@/shared/errors/isNotFoundError';

import type { ProductFormValues } from '../schema';
import type { Product } from '../types';
import { showReadOnlyNotice } from '../utils/showReadOnlyNotice';
import useProduct from './useProduct';

// On sépare l'identifiant (non modifiable) des champs du formulaire.
function toFormValues({ id: _productId, ...formValues }: Product): ProductFormValues {
  return formValues;
}

/** Logique de la modale `/product/[id]/edit` : produit à modifier, annuler, enregistrer. */
export default function useProductEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, errorProduct, refetchProduct, isRefetchingProduct } = useProduct(id);

  // Fermer la modale = revenir à l'écran du dessous (la fiche), sans rien enregistrer.
  const cancel = () => router.back();

  return {
    id,
    defaultValues: product ? toFormValues(product) : undefined,
    isProductNotFound: isNotFoundError(errorProduct),
    errorMessage: errorProduct ? getUserMessage(errorProduct) : null,
    refetchProduct,
    isRefetchingProduct,
    cancel,
    // Lecture seule : la modale reste ouverte avec la saisie, rien n'est modifié.
    save: showReadOnlyNotice,
  };
}
