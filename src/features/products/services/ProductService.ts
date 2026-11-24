import { ZodError } from 'zod';

import { ApiError, apiFetch } from '@/shared/api/client';
import { AppError } from '@/shared/errors/AppError';

import { apiProductListSchema, apiProductSchema } from '../schema';
import type { Product } from '../types';
import { ProductError } from './ProductError';

// Appels REST des produits. Aucune logique d'affichage ni de cache ici :
// uniquement « parler au serveur », vérifier ce qu'il répond et lever une AppError.
export class ProductService {
  static async list(): Promise<Product[]> {
    try {
      // On ne fait pas confiance au serveur : `parse` VALIDE la réponse avec le schéma Zod
      // et lève une ZodError si elle est mal formée. Le reste de l'app ne voit que des produits valides.
      return apiProductListSchema.parse(await apiFetch('/products'));
    } catch (error) {
      throw toProductError(error);
    }
  }

  static async get(id: string): Promise<Product> {
    try {
      return apiProductSchema.parse(await apiFetch(`/products/${encodeURIComponent(id)}`));
    } catch (error) {
      throw toProductError(error);
    }
  }
}

// Traduit toute erreur en AppError, dont le `userMessage` s'affiche tel quel à l'écran.
function toProductError(error: unknown): AppError {
  if (error instanceof ZodError) return ProductError.invalidResponse(error.issues);
  // Une 404 devient « not_found » : le QueryClient ne réessaie pas dans ce cas.
  if (error instanceof ApiError && error.status === 404) return ProductError.notFound(error);
  // Serveur injoignable, erreur 500… : l'ApiError porte déjà un message en français.
  if (error instanceof AppError) return error;
  return ProductError.fetchFailed(error);
}
