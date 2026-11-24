import type { TextStyle } from 'react-native';

/**
 * Échelle d'espacements : un nombre limité de valeurs = une interface cohérente.
 * Unité : points indépendants de la densité (pas des pixels physiques).
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const; // `as const` : les valeurs deviennent des littéraux en lecture seule

export const radius = {
  sm: 6,
  md: 12,
  pill: 999,
} as const;

/**
 * Styles de texte réutilisables. `satisfies` vérifie que chaque entrée est
 * un TextStyle valide tout en gardant le type précis de chaque clé.
 */
export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  heading: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyStrong: { fontSize: 16, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '400' },
  overline: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
} satisfies Record<string, TextStyle>;
