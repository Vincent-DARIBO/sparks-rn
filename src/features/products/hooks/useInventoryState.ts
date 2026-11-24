import { products as demoProducts } from '../data/products';
import useFavorites from './useFavorites';
import useInventory from './useInventory';
import usePerformanceDemo from './usePerformanceDemo';

/**
 * Module 5 : avec plusieurs écrans, l'inventaire ne peut plus vivre dans App.
 * Ce hook compose l'inventaire, les favoris et la démo de performances ;
 * le Provider ne fait que distribuer sa valeur.
 *
 * Solution simple et suffisante pour aujourd'hui : au Module 7, elle sera
 * remplacée par TanStack Query (données serveur) et Zustand (état client).
 */
export default function useInventoryState() {
  const inventory = useInventory(demoProducts);
  // « Pâte à tartiner 400 g » (id '1') est en favori au lancement.
  const favorites = useFavorites(['1']);
  const performanceDemo = usePerformanceDemo(demoProducts, inventory.replaceAll);

  return { ...inventory, ...favorites, ...performanceDemo };
}
