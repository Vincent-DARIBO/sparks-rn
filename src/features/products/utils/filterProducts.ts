import type { Category, Product } from '../types';

export interface ProductFilters {
  // Texte saisi dans la recherche (nom, marque ou code-barres).
  query: string;
  // `null` = toutes les catégories.
  category: Category | null;
}

// Retire accents et majuscules : « Céréales » est trouvé avec « cereales ».
// `normalize('NFD')` sépare chaque lettre de son accent, puis on supprime les accents.
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Fonction pure : facile à tester (Module 10).
export function filterProducts(products: Product[], { query, category }: ProductFilters): Product[] {
  const q = normalize(query);
  return products.filter((p) => {
    if (category && p.category !== category) return false;
    if (!q) return true;
    return (
      normalize(p.name).includes(q) ||
      normalize(p.brand).includes(q) ||
      p.barcode.includes(q)
    );
  });
}
