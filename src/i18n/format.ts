/**
 * Nombres et dates au format de la langue, par l'API `Intl` (incluse dans Hermes).
 *   fr : 5 000 · 24/11/2026 10:30:00      en : 5,000 · 11/24/26, 10:30:00 AM
 */
export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language).format(value);
}

export function formatDateTime(value: Date, language: string): string {
  return new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'medium' }).format(value);
}
