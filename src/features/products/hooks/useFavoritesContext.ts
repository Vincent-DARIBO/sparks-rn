import { useContext } from 'react';

import { FavoritesContext, type FavoritesContextValue } from '../FavoritesContext';

/** Lit les favoris partagés ; échoue clairement si le Provider est absent. */
export default function useFavoritesContext(): FavoritesContextValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavoritesContext doit être utilisé sous <FavoritesProvider>.');
  }
  return value;
}
