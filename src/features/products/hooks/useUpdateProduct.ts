import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationCallbacks } from '@/shared/types/MutationCallbacks';

import type { ProductFormValues } from '../schema';
import { ProductService } from '../services/ProductService';
import type { Product } from '../types';
import { productKeys } from './productKeys';

// Modification d'un produit depuis le formulaire (PATCH). L'alerte d'échec est globale.
export default function useUpdateProduct(id: string, { onSuccess, onError }: MutationCallbacks<Product> = {}) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: ProductFormValues) => ProductService.update(id, values),
    onSuccess: async (updated) => {
      // La réponse du serveur EST la nouvelle version : on l'écrit directement dans le cache de la fiche…
      queryClient.setQueryData(productKeys.detail(id), updated);
      // … et la liste (catalogue, tuiles de statistiques) est rechargée.
      await queryClient.invalidateQueries({ queryKey: productKeys.list() });
      onSuccess?.(updated);
    },
    onError,
  });

  return { updateProduct: mutateAsync, isUpdatingProduct: isPending };
}
