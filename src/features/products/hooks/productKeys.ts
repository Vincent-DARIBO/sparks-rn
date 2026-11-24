// Fabrique de clés de cache. La CLÉ identifie une donnée dans le cache de TanStack Query :
// même clé = même donnée, partagée par tous les écrans. Écrites une seule fois ici, elles
// évitent les fautes de frappe et permettent d'invalider tout un groupe (`productKeys.all`) d'un coup.
export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};
