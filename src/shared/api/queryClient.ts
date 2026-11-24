import { MutationCache, QueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { getUserMessage } from '@/shared/errors/getUserMessage';
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
    // Les mutations, elles, ne sont jamais réessayées (comportement par défaut) :
    // renvoyer une création en double créerait deux produits.
  },
  // Alerte GLOBALE : le MutationCache voit passer TOUTES les mutations de l'application.
  // Écrite une seule fois ici, elle s'applique à la création, à la modification et aux − / +,
  // quel que soit l'écran. Les hooks de mutation n'ont donc pas à répéter ce code.
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Dix appuis rapides sur + avec l'API arrêtée = dix échecs. Une seule alerte suffit :
      // on n'alerte que pour la DERNIÈRE mutation en cours de la même famille (même mutationKey).
      // La mutation qui échoue est encore comptée « en cours » à cet instant : plus d'une = d'autres suivent.
      const { mutationKey } = mutation.options;
      if (mutationKey && queryClient.isMutating({ mutationKey }) > 1) return;
      Alert.alert("L'enregistrement a échoué", getUserMessage(error));
    },
  }),
});
