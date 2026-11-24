import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationCallbacks } from '@/shared/types/MutationCallbacks';

import type { ProductFormValues } from '../schema';
import { ProductService } from '../services/ProductService';
import type { Product } from '../types';
import { productKeys } from './productKeys';

// Création d'un produit (POST). L'alerte d'échec est globale (MutationCache du queryClient).
export default function useCreateProduct({ onSuccess, onError }: MutationCallbacks<Product> = {}) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: ProductFormValues) => ProductService.create(values),
    onSuccess: async (product) => {
      // Le cache de la liste est périmé : on le fait recharger. `await` : la modale ne se
      // ferme qu'une fois le catalogue à jour.
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      onSuccess?.(product);
    },
    onError,
  });

  // mutateAsync renvoie une PROMESSE : l'écran peut attendre la réponse du serveur
  // (le produit créé, avec son identifiant) avant de fermer la modale.
  return { createProduct: mutateAsync, isCreatingProduct: isPending };
}
