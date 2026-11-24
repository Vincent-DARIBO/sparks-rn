import { useMemo, useState } from 'react';

import useDebouncedValue from '@/shared/hooks/useDebouncedValue';

import type { Category, Product } from '../types';
import { filterProducts } from '../utils/filterProducts';

/**
 * État de la recherche et du filtre de catégorie, et liste filtrée.
 * `query` suit la saisie immédiatement ; le filtrage utilise la valeur « debouncée ».
 */
export default function useProductFilters(products: Product[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const debouncedQuery = useDebouncedValue(query);

  const filtered = useMemo(
    () => filterProducts(products, { query: debouncedQuery, category }),
    [products, debouncedQuery, category],
  );

  return { query, setQuery, category, setCategory, filtered };
}
