import type { ReactNode } from 'react';

import { FavoritesContext } from './FavoritesContext';
import useFavorites from './hooks/useFavorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Fournit les favoris à toutes les routes (monté dans le layout racine).
 * Les produits viennent désormais du serveur (TanStack Query) : il ne reste
 * dans ce Context que l'état propre à l'utilisateur, les favoris.
 */
export default function FavoritesProvider(props: FavoritesProviderProps) {
  const { children } = props;
  // « Pâte à tartiner 400 g » (id '1') est en favori au lancement.
  const value = useFavorites(['1']);

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}
