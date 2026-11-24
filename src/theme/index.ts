// Point d'entrée unique du thème : `import { useTheme } from '@/theme'`.
// Les hooks sont des exports par défaut : on les réexporte par leur nom.
export * from './colors';
export { syncNativeColorScheme } from './syncNativeColorScheme';
export * from './tokens';
export { default as useTheme, type Theme } from './useTheme';
export { default as useThemedStyles } from './useThemedStyles';
