import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/shared/stores/settingsStore';

import { darkColors, lightColors, type ColorTokens } from './colors';
import { radius, spacing, typography } from './tokens';

export interface Theme {
  isDark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

/**
 * Renvoie le thème courant, selon le choix fait dans les Réglages :
 * « Clair », « Sombre », ou « Système » qui suit le réglage du téléphone.
 *
 * ⚠️ Prérequis : `"userInterfaceStyle": "automatic"` dans app.json,
 * sinon useColorScheme() renvoie toujours "light".
 */
export default function useTheme(): Theme {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null | undefined
  // Sélecteur : seul un changement de thème re-rend les composants, pas celui d'un interrupteur du scanner.
  const themeMode = useSettingsStore((state) => state.themeMode);
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  return useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
    }),
    [isDark],
  );
}
