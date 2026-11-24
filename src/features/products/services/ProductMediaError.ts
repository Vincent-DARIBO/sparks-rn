import { AppError } from '@/shared/errors/AppError';

// Erreurs des fonctionnalités natives d'un produit (photo, position).
export class ProductMediaError extends AppError {
  // Autorisation refusée : seul l'utilisateur peut la rétablir, dans les réglages du téléphone.
  // Exception à la règle : `message` sert ici de TITRE d'alerte, `userMessage` de texte.
  static permissionDenied(what: string, technicalDetails?: unknown): ProductMediaError {
    return new ProductMediaError(
      `Accès ${what} refusé`,
      `Scan'Stock a besoin de l'accès ${what} pour cette fonctionnalité. Vous pouvez l'autoriser dans les réglages du téléphone.`,
      'permission_denied',
      technicalDetails,
    );
  }

  // Appareil sans caméra utilisable (par exemple le simulateur iOS) : le lancement échoue.
  static cameraUnavailable(technicalDetails?: unknown): ProductMediaError {
    return new ProductMediaError(
      'camera_unavailable',
      'Appareil photo indisponible. Choisissez une photo dans la galerie.',
      'camera_unavailable',
      technicalDetails,
    );
  }

  static photoFailed(technicalDetails?: unknown): ProductMediaError {
    return new ProductMediaError('photo_failed', "Impossible d'enregistrer la photo", 'photo_failed', technicalDetails);
  }

  static locationFailed(technicalDetails?: unknown): ProductMediaError {
    return new ProductMediaError(
      'location_failed',
      'Position indisponible. Vérifiez que la localisation est activée, puis réessayez.',
      'location_failed',
      technicalDetails,
    );
  }
}
