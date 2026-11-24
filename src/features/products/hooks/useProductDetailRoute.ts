import { useLocalSearchParams, useRouter } from 'expo-router';

import { getUserMessage } from '@/shared/errors/getUserMessage';
import { isNotFoundError } from '@/shared/errors/isNotFoundError';

import { useIsFavorite, useToggleFavorite } from '../stores/favoritesStore';
import useAdjustQuantity from './useAdjustQuantity';
import useProduct from './useProduct';

/**
 * Logique de la route `/product/[id]` : lecture du paramètre d'URL,
 * produit chargé depuis l'API, favoris, retour.
 */
export default function useProductDetailRoute() {
  // Les paramètres d'URL sont TOUJOURS des chaînes (ou des tableaux de chaînes).
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, errorProduct, refetchProduct, isRefetchingProduct } = useProduct(id);
  const isFavorite = useIsFavorite(id);
  const toggleFavorite = useToggleFavorite();
  const { adjustQuantity } = useAdjustQuantity();

  // Si l'écran a été ouvert par un lien profond, l'historique est vide :
  // on retombe alors sur le catalogue.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return {
    id,
    product,
    isProductNotFound: isNotFoundError(errorProduct),
    errorMessage: errorProduct ? getUserMessage(errorProduct) : null,
    refetchProduct,
    isRefetchingProduct,
    isFavorite,
    toggleFavorite,
    adjustQuantity,
    goBack,
  };
}
