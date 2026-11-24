/**
 * ÉTAPE 05 — Navigation avec Expo Router
 *
 * Layout racine : il enveloppe TOUTES les routes de l'application.
 *  - fournit l'inventaire partagé (InventoryProvider) ;
 *  - déclare une pile (Stack) qui contient, pour l'instant, les onglets.
 *
 * Expo Router fournit déjà le SafeAreaProvider : inutile de l'ajouter.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import InventoryProvider from '@/features/products/InventoryProvider';
import { useTheme } from '@/theme';

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <InventoryProvider>
      <Stack
        screenOptions={{
          // Nos écrans dessinent leur propre en-tête (composant Header de la maquette).
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
      <StatusBar style="light" />
    </InventoryProvider>
  );
}
