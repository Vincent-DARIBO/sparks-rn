import { useLocalSearchParams, useRouter } from 'expo-router';

import useInventoryContext from './useInventoryContext';

/**
 * Logique de la route `/product/[id]` : lecture du paramètre d'URL,
 * recherche du produit, retour.
 */
export default function useProductDetailRoute() {
  // Les paramètres d'URL sont TOUJOURS des chaînes (ou des tableaux de chaînes).
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products, isFavorite, toggleFavorite, adjustQuantity } = useInventoryContext();

  const product = products.find((p) => p.id === id);
  // Si l'écran a été ouvert par un lien profond, l'historique est vide :
  // on retombe alors sur le catalogue.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return { id, product, isFavorite, toggleFavorite, adjustQuantity, goBack };
}
