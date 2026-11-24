import { useCallback, useState } from 'react';

import type { ProductFormValues } from '../schema';
import type { Product } from '../types';

/**
 * L'inventaire complet : la liste des produits ET leurs quantités.
 *
 * Changement par rapport au Jour 1 : la quantité n'est plus un état local
 * de chaque carte (ancien hook `useStock`), elle est REMONTÉE ici.
 * Une seule source de vérité : la carte, la fiche et les tuiles de
 * statistiques affichent toujours la même quantité.
 */
export default function useInventory(initialProducts: Product[]) {
  const [products, setProducts] = useState(initialProducts);

  // Ajoute `delta` (positif ou négatif) au stock d'un produit, jamais sous zéro.
  // Immutabilité : on crée un nouveau tableau et un nouvel objet pour le produit modifié.
  const adjustQuantity = useCallback((id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
    );
  }, []);

  // Remplace tout le catalogue (démo de performances : 12 ↔ 5 000 produits).
  const replaceAll = useCallback((nextProducts: Product[]) => setProducts(nextProducts), []);

  // Module 6 : remplace les champs modifiables d'un produit, l'identifiant ne change pas.
  // Fonctionne aussi en démo 5 000 produits : ils vivent dans ce même état.
  const updateProduct = useCallback((id: string, values: ProductFormValues) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { id, ...values } : p)));
  }, []);

  // Module 6 : ajoute un produit EN TÊTE du catalogue et renvoie son identifiant (pour ouvrir sa fiche).
  // Identifiant provisoire, unique sur cet appareil : au Jour 3, c'est l'API qui le fournira.
  const addProduct = useCallback((values: ProductFormValues) => {
    const id = `local-${Date.now().toString(36)}`;
    setProducts((prev) => [{ id, ...values }, ...prev]);
    return id;
  }, []);

  return { products, adjustQuantity, replaceAll, addProduct, updateProduct };
}
