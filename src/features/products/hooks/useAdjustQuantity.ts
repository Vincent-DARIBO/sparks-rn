import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { MutationCallbacks } from '@/shared/types/MutationCallbacks';

import { ProductService } from '../services/ProductService';
import type { Product } from '../types';
import { clampQuantity } from '../utils/stock';
import { productKeys } from './productKeys';

const ADJUST_QUANTITY_KEY = [...productKeys.all, 'adjust-quantity'] as const;
// Les mutations d'un même « scope » partent L'UNE APRÈS L'AUTRE, dans l'ordre des appuis.
// Sans lui, dix requêtes parallèles pourraient arriver dans le désordre (13 après 14)
// et le serveur garderait une valeur dépassée.
const ADJUST_QUANTITY_SCOPE = { id: 'adjust-quantity' };

interface AdjustQuantityVariables {
  id: string;
  quantity: number;
}

// Produit tel qu'il est affiché : la fiche (si elle est en cache), sinon la ligne de la liste.
function getCachedProduct(queryClient: QueryClient, id: string): Product | undefined {
  return (
    queryClient.getQueryData<Product>(productKeys.detail(id)) ??
    queryClient.getQueryData<Product[]>(productKeys.list())?.find((p) => p.id === id)
  );
}

// La liste et la fiche sont deux entrées DIFFÉRENTES du cache : on écrit dans les deux,
// sinon la carte du catalogue et la fiche afficheraient des quantités différentes.
function setCachedQuantity(queryClient: QueryClient, id: string, getQuantity: (current: number) => number) {
  queryClient.setQueryData<Product[]>(productKeys.list(), (list) =>
    list?.map((p) => (p.id === id ? { ...p, quantity: getQuantity(p.quantity) } : p)),
  );
  queryClient.setQueryData<Product>(productKeys.detail(id), (p) =>
    p ? { ...p, quantity: getQuantity(p.quantity) } : p,
  );
}

/**
 * Boutons − / + (carte et fiche) avec MISE À JOUR OPTIMISTE : l'écran change tout de suite,
 * le serveur est prévenu ensuite. L'alerte d'échec est globale (MutationCache du queryClient).
 *
 * On envoie la NOUVELLE quantité (ex. 13), jamais « +1 » : si une requête part deux fois,
 * « quantité = 13 » donne deux fois le même résultat, alors que « +1 » compterait double.
 */
export default function useAdjustQuantity({ onSuccess, onError }: MutationCallbacks<Product> = {}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ADJUST_QUANTITY_KEY,
    scope: ADJUST_QUANTITY_SCOPE,
    mutationFn: ({ id, quantity }: AdjustQuantityVariables) => ProductService.update(id, { quantity }),

    // 1. onMutate, AVANT l'envoi : on modifie le cache tout de suite, l'écran réagit sans attendre.
    onMutate: async ({ id, quantity }) => {
      // Un rechargement en cours (liste ou fiche) ramènerait l'ANCIENNE valeur du serveur
      // et écraserait notre valeur optimiste : on l'annule d'abord.
      await queryClient.cancelQueries({ queryKey: productKeys.all });
      const previousQuantity = getCachedProduct(queryClient, id)?.quantity ?? quantity;
      setCachedQuantity(queryClient, id, () => quantity);
      // Ce « contexte » est transmis à onError : de quoi revenir en arrière.
      return { quantityChange: quantity - previousQuantity };
    },

    onSuccess,

    // 2. onError, si l'envoi échoue : on annule NOTRE changement (−1 si l'on avait ajouté 1).
    // On ne restaure pas une « photo » de l'avant : avec dix appuis en vol, chaque échec
    // remettrait une photo différente. Retirer chacun son changement ramène bien à la valeur de départ.
    onError: (error, { id }, context) => {
      setCachedQuantity(queryClient, id, (current) => current - (context?.quantityChange ?? 0));
      onError?.(error);
    },

    // 3. onSettled, succès ou échec : on resynchronise le cache avec le serveur, mais seulement
    // après la DERNIÈRE mutation en cours (elle compte encore pour 1 ici). Sinon, la réponse
    // d'un appui ancien ramènerait une valeur dépassée et l'affichage « clignoterait ».
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: ADJUST_QUANTITY_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: productKeys.all });
      }
    },
  });

  // useCallback : une référence STABLE, pour ne pas redessiner toutes les cartes mémoïsées.
  const adjustQuantity = useCallback(
    (id: string, delta: number) => {
      // Valeur la plus récente du cache (elle inclut les appuis précédents encore en vol).
      const current = getCachedProduct(queryClient, id);
      if (!current) return;
      // Bornée, comme dans le formulaire : une valeur hors bornes serait
      // enregistrée par le serveur puis refusée par notre validation Zod au retour.
      const quantity = clampQuantity(current.quantity + delta);
      if (quantity === current.quantity) return;
      mutate({ id, quantity });
    },
    [queryClient, mutate],
  );

  return { adjustQuantity, isAdjustingQuantity: isPending };
}
