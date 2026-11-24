import { AppError } from '@/shared/errors/AppError';

export class ProductError extends AppError {
  static fetchFailed(technicalDetails?: unknown): ProductError {
    return new ProductError(
      'fetch_failed',
      'Impossible de charger les produits',
      'fetch_failed',
      technicalDetails,
    );
  }

  static createFailed(technicalDetails?: unknown): ProductError {
    return new ProductError('create_failed', 'Impossible de créer le produit', 'create_failed', technicalDetails);
  }

  static updateFailed(technicalDetails?: unknown): ProductError {
    return new ProductError(
      'update_failed',
      "Impossible d'enregistrer les modifications du produit",
      'update_failed',
      technicalDetails,
    );
  }

  static notFound(technicalDetails?: unknown): ProductError {
    return new ProductError('not_found', 'Ce produit est introuvable', 'not_found', technicalDetails);
  }

  static invalidResponse(technicalDetails?: unknown): ProductError {
    return new ProductError(
      'invalid_response',
      'Le serveur a renvoyé des données inattendues',
      'invalid_response',
      technicalDetails,
    );
  }
}
