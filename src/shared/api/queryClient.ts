import { QueryClient } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/errors/isNotFoundError';

const MAX_RETRIES = 2;

// Le client TanStack Query de l'application : il détient le CACHE des données
// serveur. Un seul pour toute l'application, créé hors de tout composant.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Une donnée de moins de 30 s est fraîche : pas de rechargement.
      staleTime: 30_000,
      // Un produit introuvable le restera : inutile de réessayer. Sinon, deux nouveaux essais.
      retry: (failureCount, error) => !isNotFoundError(error) && failureCount < MAX_RETRIES,
    },
  },
});
