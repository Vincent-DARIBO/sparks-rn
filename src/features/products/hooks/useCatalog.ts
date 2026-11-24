import { useEffect } from 'react';

import useFavorites from './useFavorites';

/**
 * État de l'écran catalogue : favoris et libellé du compteur affiché dans
 * l'en-tête. Le composant `App` ne fait qu'afficher ces valeurs.
 */
export default function useCatalog(initialFavoriteIds: string[] = []) {
  const { toggleFavorite, isFavorite, favoritesCount } = useFavorites(initialFavoriteIds);

  // Accord en français : « 0 produit », « 1 produit », « 2 produits ».
  const favoritesLabel = `${favoritesCount} ${favoritesCount > 1 ? 'produits' : 'produit'} en favori`;

  // useEffect : s'exécute APRÈS le rendu, à chaque changement de favoritesCount.
  // Réservé à la synchronisation avec l'extérieur (au Module 7 : persistance).
  useEffect(() => {
    console.log(`[Scan'Stock] ${favoritesCount} favori(s)`);
  }, [favoritesCount]);

  return { toggleFavorite, isFavorite, favoritesCount, favoritesLabel };
}
