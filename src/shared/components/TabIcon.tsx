import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { useTheme } from '@/theme';

interface TabIconProps {
  name: ComponentProps<typeof Ionicons>['name'];
  size: number;
  focused: boolean;
}

/**
 * Icône d'onglet. On calcule la couleur nous-mêmes à partir de `focused` :
 * la couleur fournie par Tabs est typée ColorValue (qui peut valoir null),
 * alors qu'Ionicons attend une chaîne.
 */
export default function TabIcon(props: TabIconProps) {
  const { name, size, focused } = props;
  const { colors } = useTheme();

  return <Ionicons name={name} size={size} color={focused ? colors.primary : colors.textMuted} />;
}
