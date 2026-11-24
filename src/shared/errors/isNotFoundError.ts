import { AppError } from './AppError';

// Vrai pour une erreur « introuvable » (code `not_found`, levé par les services sur une 404).
export function isNotFoundError(error: unknown): boolean {
  return error instanceof AppError && error.code === 'not_found';
}
