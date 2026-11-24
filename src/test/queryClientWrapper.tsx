import { notifyManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

// Par défaut, TanStack Query prévient React avec un `setTimeout(0)`. Dans un test, ce message
// peut donc arriver APRÈS que `waitFor` a rendu la main : React reçoit alors une mise à jour
// hors de `act(...)` et affiche un avertissement, de façon intermittente.
// En micro-tâche, le message part avant que le test reprenne la main : plus d'avertissement.
// Ce réglage vit ici (et non dans jest.setup.ts) car seuls les tests qui utilisent TanStack
// Query importent ce fichier.
notifyManager.setScheduler(queueMicrotask);

/**
 * Un QueryClient NEUF par test : aucun cache n'est partagé d'un test à l'autre, donc l'ordre
 * d'exécution n'a aucune importance. On n'utilise jamais celui de l'app, qui affiche une alerte
 * à chaque échec de mutation.
 *
 * `retry: false` : une erreur échoue tout de suite, au lieu d'être réessayée plusieurs fois.
 * `gcTime: Infinity` : par défaut, TanStack Query programme un minuteur de 5 minutes pour vider
 * le cache. Ce minuteur garde Jest en vie après la fin des tests (« Jest did not exit »).
 * Sans minuteur de nettoyage, Jest s'arrête seul. Il faut le régler pour les requêtes ET les mutations.
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
}

// `renderHook` n'affiche aucun écran : ce « wrapper » fournit le QueryClientProvider dont le hook a besoin.
export function createWrapper(queryClient: QueryClient) {
  return function Wrapper(props: WrapperProps) {
    const { children } = props;
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
