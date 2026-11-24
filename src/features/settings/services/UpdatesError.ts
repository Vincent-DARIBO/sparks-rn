import { AppError } from '@/shared/errors/AppError';

export class UpdatesError extends AppError {
  static checkFailed(technicalDetails?: unknown): UpdatesError {
    return new UpdatesError(
      'check_failed',
      'Impossible de rechercher une mise à jour. Vérifiez votre connexion, puis réessayez.',
      'check_failed',
      technicalDetails,
    );
  }

  static downloadFailed(technicalDetails?: unknown): UpdatesError {
    return new UpdatesError(
      'download_failed',
      'Impossible de télécharger la mise à jour. Vérifiez votre connexion, puis réessayez.',
      'download_failed',
      technicalDetails,
    );
  }

  static reloadFailed(technicalDetails?: unknown): UpdatesError {
    return new UpdatesError(
      'reload_failed',
      "Impossible de redémarrer l'application pour appliquer la mise à jour",
      'reload_failed',
      technicalDetails,
    );
  }
}
