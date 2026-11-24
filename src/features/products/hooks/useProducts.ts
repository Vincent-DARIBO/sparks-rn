import { useQuery } from '@tanstack/react-query';

import { ProductService } from '../services/ProductService';
import { productKeys } from './productKeys';

// Liste des produits (écran Catalogue). Une requête TanStack Query = une clé + une fonction :
// la clé range le résultat dans le cache, la fonction (queryFn) va le chercher en déléguant au service.
export default function useProducts() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: productKeys.list(),
    queryFn: () => ProductService.list(),
  });

  return {
    products: data,
    isLoadingProducts: isLoading,
    errorProducts: error,
    refetchProducts: refetch,
    isRefetchingProducts: isRefetching,
  };
}
