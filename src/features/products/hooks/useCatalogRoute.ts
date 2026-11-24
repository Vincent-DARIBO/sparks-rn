import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { getUserMessage } from '@/shared/errors/getUserMessage';

import { generateProducts } from '../data/generateProducts';
import { showReadOnlyNotice } from '../utils/showReadOnlyNotice';
import useFavoritesContext from './useFavoritesContext';
import useProducts from './useProducts';

const LARGE_DATASET_SIZE = 5000;

// Route dynamique : `/product/1`, `/product/2`… (fichier product/[id]/index.tsx).
// Fonctions définies hors du hook : leur référence est stable, la liste mémoïsée
// n'est donc pas redessinée à chaque rendu.
const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });
const openNewProduct = () => router.push('/product/new');

// Logique de la route Catalogue. Module 7 : les produits viennent de l'API (TanStack Query).
export default function useCatalogRoute() {
  const { products, isLoadingProducts, errorProducts, refetchProducts, isRefetchingProducts } = useProducts();
  const { isFavorite, toggleFavorite, favoritesCount } = useFavoritesContext();
  const [isLargeDataset, setIsLargeDataset] = useState(false);

  // Démo de performances (Module 4), en lecture seule : ces produits n'existent pas sur le serveur.
  const largeDataset = useMemo(
    () => (isLargeDataset ? generateProducts(LARGE_DATASET_SIZE) : []),
    [isLargeDataset],
  );

  return {
    products: isLargeDataset ? largeDataset : products,
    isLoadingProducts,
    errorMessage: errorProducts ? getUserMessage(errorProducts) : null,
    refetchProducts,
    isRefetchingProducts,
    isFavorite,
    toggleFavorite,
    favoritesCount,
    isLargeDataset,
    setIsLargeDataset,
    adjustQuantity: showReadOnlyNotice,
    openProduct,
    addProduct: openNewProduct,
  };
}
