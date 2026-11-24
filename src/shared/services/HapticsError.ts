import { AppError } from '@/shared/errors/AppError';

export class HapticsError extends AppError {
  static notifyFailed(technicalDetails?: unknown): HapticsError {
    return new HapticsError('notify_failed', 'Impossible de faire vibrer le téléphone', 'notify_failed', technicalDetails);
  }
}
