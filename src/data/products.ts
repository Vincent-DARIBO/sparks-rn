/**
 * Jeu de données de départ de Scan'Stock.
 *
 * Ces produits simulent l'inventaire d'une petite épicerie.
 * Les codes-barres (EAN-13) sont ceux de vrais produits : ils serviront
 * au Jour 3 pour interroger l'API publique Open Food Facts.
 *
 * Module 2 : le tableau est maintenant typé. Essayez d'écrire
 * `category: 'fruits'` sur une ligne : TypeScript refuse immédiatement.
 */
import type { Product } from '../types/product';

export const products: Product[] = [
  { id: '1', barcode: '3017620422003', name: 'Pâte à tartiner 400 g', brand: 'Nutella', category: 'petit-dejeuner', quantity: 24, minQuantity: 10 },
  { id: '2', barcode: '5449000000996', name: 'Soda cola 33 cl', brand: 'Coca-Cola', category: 'boissons', quantity: 6, minQuantity: 12 },
  { id: '3', barcode: '3274080005003', name: 'Eau de source 1,5 L', brand: 'Cristaline', category: 'boissons', quantity: 48, minQuantity: 24 },
  { id: '4', barcode: '7622210449283', name: 'Biscuits fourrés chocolat', brand: 'Prince', category: 'biscuits', quantity: 0, minQuantity: 8 },
  { id: '5', barcode: '8000500310427', name: 'Biscuits fourrés noisette', brand: 'Nutella Biscuits', category: 'biscuits', quantity: 15, minQuantity: 8 },
  { id: '6', barcode: '3175680011480', name: 'Céréales complètes', brand: 'Gerblé', category: 'petit-dejeuner', quantity: 9, minQuantity: 6 },
  { id: '7', barcode: '3228857000166', name: 'Pain de mie complet', brand: "Harrys", category: 'epicerie', quantity: 3, minQuantity: 5 },
  { id: '8', barcode: '3046920022606', name: 'Chocolat noir 70 %', brand: 'Lindt', category: 'epicerie', quantity: 31, minQuantity: 10 },
  { id: '9', barcode: '3017760000109', name: 'Petits beurre', brand: 'LU', category: 'biscuits', quantity: 12, minQuantity: 10 },
  { id: '10', barcode: '5000112637922', name: 'Soda cola zéro 33 cl', brand: 'Coca-Cola', category: 'boissons', quantity: 18, minQuantity: 12 },
  { id: '11', barcode: '3045320094084', name: 'Spaghetti 500 g', brand: 'Panzani', category: 'epicerie', quantity: 40, minQuantity: 15 },
  { id: '12', barcode: '3033710065967', name: 'Café moulu 250 g', brand: 'Carte Noire', category: 'petit-dejeuner', quantity: 2, minQuantity: 6 },
];
