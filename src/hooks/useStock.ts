import { useRef, useState } from 'react';

import type { StockStatus } from '../types/product';
import { getStockStatus } from '../utils/stock';

/** Ce que renvoie le hook : typer le retour documente l'API du hook. */
export interface UseStockResult {
  quantity: number;
  status: StockStatus;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

/**
 * Hook personnalisé : gère la quantité en stock d'UN produit.
 *
 * Un hook personnalisé est une simple fonction dont le nom commence par `use`
 * et qui appelle d'autres hooks. Il permet d'extraire et de réutiliser
 * une logique d'état, sans rien afficher.
 */
export default function useStock(initialQuantity: number, minQuantity: number): UseStockResult {
  const [quantity, setQuantity] = useState(initialQuantity);
  // useRef : mémorise la valeur initiale SANS déclencher de nouveau rendu.
  // Elle ne change pas si le parent repasse une autre valeur initiale.
  const initialRef = useRef(initialQuantity);

  // Forme fonctionnelle `setX(prev => ...)` : toujours partir de la valeur
  // la plus récente, même si plusieurs mises à jour s'enchaînent.
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(0, q - 1)); // jamais négatif
  const reset = () => setQuantity(initialRef.current);

  return {
    quantity,
    status: getStockStatus(quantity, minQuantity), // valeur dérivée, pas un état
    increment,
    decrement,
    reset,
  };
}
