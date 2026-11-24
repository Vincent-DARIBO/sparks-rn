import { createContext } from 'react';

import type useFavorites from './hooks/useFavorites';

export type FavoritesContextValue = ReturnType<typeof useFavorites>;

// `null` par défaut : on détecte un oubli du Provider (voir useFavoritesContext).
export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
