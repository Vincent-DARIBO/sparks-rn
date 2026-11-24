import { useMemo } from 'react';

import useTheme, { type Theme } from './useTheme';

/**
 * Renvoie le thème courant et les styles qui en dépendent.
 * `createStyles` doit être une fonction définie au niveau du module (référence
 * stable) : les styles ne sont recréés que lorsque le thème change.
 * Le générique `T` reprend le type exact renvoyé par `StyleSheet.create`.
 */
export default function useThemedStyles<T>(createStyles: (theme: Theme) => T) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme, createStyles]);

  return { theme, styles };
}
