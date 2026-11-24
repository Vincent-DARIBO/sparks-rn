import { AppError } from './AppError';

// Une AppError porte déjà un message en français ; toute autre erreur reçoit un message générique.
export function getUserMessage(error: unknown): string {
  return error instanceof AppError ? error.userMessage : 'Une erreur inattendue est survenue';
}
