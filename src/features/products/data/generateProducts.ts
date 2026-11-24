import type { Product } from '../types';
import { products as baseProducts } from './products';

/**
 * Génère un grand catalogue de démonstration à partir des 12 produits réels.
 * Sert uniquement à mesurer les performances de FlatList et de FlashList.
 *
 * Générateur pseudo-aléatoire déterministe : le même `count` donne toujours
 * le même catalogue, donc des mesures comparables d'un essai à l'autre.
 */
export function generateProducts(count: number): Product[] {
  let seed = 42;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: count }, (_, index) => {
    const model = baseProducts[index % baseProducts.length];
    return {
      ...model,
      id: `gen-${index + 1}`, // identifiant unique : indispensable pour keyExtractor
      name: `${model.name} · lot ${Math.floor(index / baseProducts.length) + 1}`,
      quantity: Math.floor(random() * 40),
      minQuantity: 5 + Math.floor(random() * 10),
    };
  });
}
