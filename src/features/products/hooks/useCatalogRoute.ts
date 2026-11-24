import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { getUserMessage } from '@/shared/errors/getUserMessage';

import { generateProducts } from '../data/generateProducts';
import { useFavoritesCount } from '../stores/favoritesStore';
import useAdjustQuantity from './useAdjustQuantity';
import useDeleteProduct from './useDeleteProduct';
import useProducts from './useProducts';

const LARGE_DATASET_SIZE = 5000;

const openNewProduct = () => router.push('/product/new');
const ignoreQuantityChange = () => {};

// Logique de la route Catalogue. Module 7 : les produits viennent de l'API (TanStack Query).
export default function useCatalogRoute() {
  const { products, isLoadingProducts, errorProducts, refetchProducts } = useProducts();
  // Seul le NOMBRE de favoris est lu ici (sous-titre de l'en-tête).
  const favoritesCount = useFavoritesCount();
  const { adjustQuantity } = useAdjustQuantity();
  const { deleteProduct } = useDeleteProduct();
  const [isLargeDataset, setIsLargeDataset] = useState(false);
  // Rechargement demandé par l'UTILISATEUR, et par quel geste : tirage de la liste ou bouton « Réessayer ».
  // On n'utilise pas `isRefetching` de TanStack Query : il est vrai aussi pour les rechargements
  // en arrière-plan (après chaque − / +, chaque enregistrement). L'indicateur de tirage
  // apparaîtrait alors à chaque appui et décalerait la liste sous le doigt.
  // Le geste est retenu pour n'afficher qu'UN indicateur : celui de la liste OU celui du bouton.
  const [userRefresh, setUserRefresh] = useState<'pull' | 'retry' | null>(null);

  const refreshProducts = async (gesture: 'pull' | 'retry') => {
    setUserRefresh(gesture);
    try {
      // `refetch` ne lève pas d'erreur (l'échec est rangé dans `errorProducts`) et se termine aussi
      // s'il est annulé par un appui sur − / + : l'indicateur ne peut pas rester bloqué.
      await refetchProducts();
    } finally {
      // `finally` : remis à zéro dans tous les cas. Si l'écran a été démonté entre-temps, React ignore cet appel.
      setUserRefresh(null);
    }
  };

  // Route dynamique : `/product/1`, `/product/2`… (fichier product/[id]/index.tsx).
  const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });
  const removeProduct = (id: string) => deleteProduct(id);

  // Démo de performances (Module 4) : ces produits n'existent pas sur le serveur, − et + n'y font rien.
  const largeDataset = useMemo(
    () => (isLargeDataset ? generateProducts(LARGE_DATASET_SIZE) : []),
    [isLargeDataset],
  );

  return {
    products: isLargeDataset ? largeDataset : products,
    isLoadingProducts,
    errorMessage: errorProducts ? getUserMessage(errorProducts) : null,
    pullToRefresh: () => void refreshProducts('pull'),
    isPullRefreshing: userRefresh === 'pull',
    retry: () => void refreshProducts('retry'),
    isRetrying: userRefresh === 'retry',
    favoritesCount,
    isLargeDataset,
    setIsLargeDataset,
    adjustQuantity: isLargeDataset ? ignoreQuantityChange : adjustQuantity,
    // Même raison que pour − / + : ces produits n'existent pas sur le serveur, et le geste est désactivé
    // (aucune ligne glissable : la liste de 5 000 produits ne coûte rien de plus qu'avant).
    deleteProduct: isLargeDataset ? undefined : removeProduct,
    openProduct,
    addProduct: openNewProduct,
  };
}
