import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { getUserMessage } from '@/shared/errors/getUserMessage';

import { generateProducts } from '../data/generateProducts';
import { useFavoritesCount } from '../stores/favoritesStore';
import { LARGE_DATASET_SIZE } from '../types';
import useAdjustQuantity from './useAdjustQuantity';
import useDeleteProduct from './useDeleteProduct';
import useProducts from './useProducts';

// Route dynamique : `/product/1`, `/product/2`… (fichier product/[id]/index.tsx).
// Fonctions définies HORS du hook : elles ne dépendent de rien du rendu, leur référence ne
// change donc jamais. Définie DANS le hook, `openProduct` était recréée à chaque rendu :
// le profiler affichait « Props changed: onPress » sur chaque carte (le `memo` de la carte
// comparait une nouvelle fonction à l'ancienne) et `renderItem` changeait, donc FlashList
// re-rendait toutes les cellules. `memo` ne sert à rien si une prop change à chaque rendu.
const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });
const openNewProduct = () => router.push('/product/new');
const ignoreQuantityChange = () => {};

// Logique de la route Catalogue. Module 7 : les produits viennent de l'API (TanStack Query).
export default function useCatalogRoute() {
  const { products, isLoadingProducts, errorProducts, refetchProducts } = useProducts();
  // Seul le NOMBRE de favoris est lu ici (sous-titre de l'en-tête).
  const favoritesCount = useFavoritesCount();
  const { adjustQuantity } = useAdjustQuantity();
  // `deleteProduct` est le `mutate` de TanStack Query : sa référence est stable. On le transmet tel quel.
  // L'envelopper (`(id) => deleteProduct(id)`) recréait une fonction à chaque rendu : `renderItem` changeait
  // (c'est une de ses dépendances), FlashList le rappelait pour toutes les cellules, et le profiler affichait
  // « Props changed: onDelete » sur chaque ligne glissable. Les cartes étaient épargnées par leur `memo`.
  // Cette cause ne jouait pas en « Démo perfs » : la suppression y vaut `undefined`.
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
    deleteProduct: isLargeDataset ? undefined : deleteProduct,
    openProduct,
    addProduct: openNewProduct,
  };
}
