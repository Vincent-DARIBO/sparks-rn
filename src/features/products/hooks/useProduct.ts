import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ProductService } from '../services/ProductService';
import type { Product } from '../types';
import { productKeys } from './productKeys';

// Un produit (écran Fiche).
export default function useProduct(id: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.get(id),
    enabled: id.length > 0,
    // initialData : si la liste est déjà en cache (fiche ouverte depuis le catalogue),
    // la fiche s'affiche IMMÉDIATEMENT avec ces données, sans indicateur de chargement…
    initialData: () => queryClient.getQueryData<Product[]>(productKeys.list())?.find((p) => p.id === id),
    // … et la date de ces données permet à TanStack Query de savoir si elles sont périmées :
    // si oui, il recharge le produit en arrière-plan et la fiche se met à jour.
    initialDataUpdatedAt: () => queryClient.getQueryState(productKeys.list())?.dataUpdatedAt,
  });

  return {
    product: data,
    isLoadingProduct: isLoading,
    errorProduct: error,
    refetchProduct: refetch,
    isRefetchingProduct: isRefetching,
  };
}
