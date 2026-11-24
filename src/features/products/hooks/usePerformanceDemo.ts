import { useState } from 'react';

import { generateProducts } from '../data/generateProducts';
import type { Product } from '../types';

const LARGE_DATASET_SIZE = 5000;

/**
 * Démo de performances (développement uniquement) : bascule le catalogue
 * entre les produits de départ et 5 000 produits générés.
 */
export default function usePerformanceDemo(
  initialProducts: Product[],
  replaceAll: (nextProducts: Product[]) => void,
) {
  const [isLargeDataset, setIsLargeDataset] = useState(false);

  const toggleLargeDataset = (value: boolean) => {
    setIsLargeDataset(value);
    replaceAll(value ? generateProducts(LARGE_DATASET_SIZE) : initialProducts);
  };

  return { isLargeDataset, toggleLargeDataset };
}
