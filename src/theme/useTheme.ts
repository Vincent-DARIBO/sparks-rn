import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

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
 * Renvoie le thème courant selon le réglage clair / sombre du téléphone.
 *
 * ⚠️ Prérequis : `"userInterfaceStyle": "automatic"` dans app.json,
 * sinon useColorScheme() renvoie toujours "light".
 *
 * Au Module 7, on ajoutera un choix manuel (clair / sombre / système)
 * stocké dans Zustand.
 */
export default function useTheme(): Theme {
  const scheme = useColorScheme(); // 'light' | 'dark' | null | undefined
  const isDark = scheme === 'dark';

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
