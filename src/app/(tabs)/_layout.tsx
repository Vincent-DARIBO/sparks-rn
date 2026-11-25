import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import TabIcon from '@/shared/components/TabIcon';
import { useTheme } from '@/theme';

/**
 * Groupe `(tabs)` : les parenthèses créent un groupe de routes qui
 * n'apparaît PAS dans l'URL. `/` affiche donc l'onglet Catalogue.
 */
export default function TabsLayout() {
  const { colors } = useTheme();
  // Les titres des onglets changent avec la langue.
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.catalog'),
          tabBarIcon: ({ focused, size }) => <TabIcon name="list" size={size} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: t('tabs.scanner'),
          tabBarIcon: ({ focused, size }) => <TabIcon name="barcode-outline" size={size} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused, size }) => <TabIcon name="settings-outline" size={size} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
