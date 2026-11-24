/**
 * Types métier de Scan'Stock.
 *
 * Union de chaînes littérales plutôt qu'un `enum` : plus léger, aucun code
 * généré à l'exécution, et l'autocomplétion fonctionne pareil.
 */
export type Category = 'boissons' | 'epicerie' | 'biscuits' | 'petit-dejeuner';

/** Un produit de l'inventaire. */
export interface Product {
  id: string;
  /** Code-barres EAN-13 (sert au scan et à l'API Open Food Facts). */
  barcode: string;
  name: string;
  brand: string;
  category: Category;
  /** Quantité en stock. */
  quantity: number;
  /** Seuil d'alerte : en dessous ou à égalité, il faut réapprovisionner. */
  minQuantity: number;
  /** Photo du produit : fichier copié dans le dossier de l'application (propre à CE téléphone). */
  photoUri?: string;
  /** Emplacement de stockage, enregistré avec la position du téléphone. */
  location?: ProductLocation;
}

/** Position GPS et adresse lisible, enregistrées à un instant donné. */
export interface ProductLocation {
  latitude: number;
  longitude: number;
  /** Adresse lisible obtenue par géocodage inverse (ou coordonnées à défaut). */
  label: string;
  /** Date de l'enregistrement, au format ISO 8601 (ex. 2026-11-24T09:30:00.000Z). */
  recordedAt: string;
}

/** Champs modifiables d'un produit, tous facultatifs : un PATCH n'envoie que ce qui change. */
export type ProductPatch = Partial<Omit<Product, 'id'>>;

/** Quantité maximale d'un produit : partagée par le schéma du formulaire et les boutons + . */
export const MAX_QUANTITY = 9999;

/** État du stock d'un produit, calculé à partir de la quantité et du seuil. */
export type StockStatus = 'out' | 'low' | 'ok';

/** Libellés affichables, indexés par catégorie. `Record` garantit l'exhaustivité. */
export const categoryLabels: Record<Category, string> = {
  boissons: 'Boissons',
  epicerie: 'Épicerie',
  biscuits: 'Biscuits',
  'petit-dejeuner': 'Petit-déjeuner',
};
