import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationCallbacks } from '@/shared/types/MutationCallbacks';

import { ProductService } from '../services/ProductService';
import type { Product } from '../types';
import { productKeys } from './productKeys';

// Suppression d'un produit (DELETE). L'alerte d'échec est globale (MutationCache du queryClient).
//
// Pas de mise à jour optimiste ici, contrairement à − / + : une suppression est définitive et confirmée
// par l'utilisateur. La carte reste affichée pendant la requête ; si le serveur échoue, elle est
// toujours là, sans rien à annuler. Elle disparaît dès que le serveur a répondu.
export default function useDeleteProduct({ onSuccess, onError }: MutationCallbacks<void> = {}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => ProductService.remove(id),
    onSuccess: async (_data, id) => {
      // La fiche du produit ne doit plus être resservie depuis le cache (lien ouvert après coup).
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Le produit disparaît tout de suite de la liste (catalogue et tuiles de statistiques)…
      queryClient.setQueryData<Product[]>(productKeys.list(), (list) => list?.filter((p) => p.id !== id));
      // … puis la liste est resynchronisée avec le serveur.
      await queryClient.invalidateQueries({ queryKey: productKeys.list() });
      onSuccess?.();
    },
    onError,
  });

  return { deleteProduct: mutate, isDeletingProduct: isPending };
}
