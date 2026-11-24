import { useLocalSearchParams, useRouter } from 'expo-router';

import useInventoryContext from './useInventoryContext';

/** Logique de la modale `/product/[id]/edit` : produit à modifier et fermeture. */
export default function useProductEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products } = useInventoryContext();

  const product = products.find((p) => p.id === id);
  // Fermer la modale = revenir à l'écran du dessous (la fiche).
  const close = () => router.back();

  return { product, close };
}
