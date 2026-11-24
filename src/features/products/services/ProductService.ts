import { ZodError } from 'zod';

import { ApiError, apiFetch } from '@/shared/api/client';
import { AppError } from '@/shared/errors/AppError';

import { apiProductListSchema, apiProductSchema, type ProductFormValues } from '../schema';
import type { Product, ProductPatch } from '../types';
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
      throw toProductError(error, ProductError.fetchFailed);
    }
  }

  static async get(id: string): Promise<Product> {
    try {
      return apiProductSchema.parse(await apiFetch(`/products/${encodeURIComponent(id)}`));
    } catch (error) {
      throw toProductError(error, ProductError.fetchFailed);
    }
  }

  // POST : le serveur attribue l'identifiant et renvoie le produit complet.
  static async create(values: ProductFormValues): Promise<Product> {
    try {
      return apiProductSchema.parse(await apiFetch('/products', { method: 'POST', body: values }));
    } catch (error) {
      throw toProductError(error, ProductError.createFailed);
    }
  }

  // PATCH : seuls les champs envoyés sont modifiés (le formulaire entier, la seule quantité, la photo…).
  static async update(id: string, values: ProductPatch): Promise<Product> {
    try {
      return apiProductSchema.parse(
        await apiFetch(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: values }),
      );
    } catch (error) {
      throw toProductError(error, ProductError.updateFailed);
    }
  }
}

// Traduit toute erreur en AppError, dont le `userMessage` s'affiche tel quel à l'écran.
// `fallback` fabrique l'erreur propre à l'opération (lecture, création, modification) pour les cas imprévus.
function toProductError(error: unknown, fallback: (technicalDetails: unknown) => ProductError): AppError {
  if (error instanceof ZodError) return ProductError.invalidResponse(error.issues);
  // Une 404 devient « not_found » : le QueryClient ne réessaie pas dans ce cas.
  if (error instanceof ApiError && error.status === 404) return ProductError.notFound(error);
  // Serveur injoignable, erreur 500… : l'ApiError porte déjà un message en français.
  if (error instanceof AppError) return error;
  return fallback(error);
}
