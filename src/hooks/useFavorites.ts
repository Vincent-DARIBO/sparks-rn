import useToggleSet from './useToggleSet';

/**
 * Favoris de l'utilisateur : spécialisation de `useToggleSet` pour des
 * identifiants de produits. TypeScript infère `T = string`.
 *
 * Au Module 7, ces favoris seront persistés avec Zustand + MMKV.
 */
export default function useFavorites(initialIds: string[] = []) {
  const { values, toggle, has, count } = useToggleSet<string>(initialIds);

  return {
    favoriteIds: values,
    toggleFavorite: toggle,
    isFavorite: has,
    favoritesCount: count,
  };
}
