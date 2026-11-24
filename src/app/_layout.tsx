/**
 * ÉTAPE 05 — Navigation avec Expo Router
 *
 * Layout racine : il enveloppe TOUTES les routes de l'application.
 *  - fournit le suivi du clavier (KeyboardProvider, ajouté au Module 6) ;
 *  - fournit l'inventaire partagé (InventoryProvider) ;
 *  - déclare une pile (Stack) : les onglets, la fiche produit, la modale de modification.
 *
 * Expo Router fournit déjà le SafeAreaProvider : inutile de l'ajouter.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import InventoryProvider from '@/features/products/InventoryProvider';
import { useTheme } from '@/theme';

// Route d'ancrage de la pile : si l'app s'ouvre directement sur une fiche (lien profond),
// les onglets sont placés dessous, et le retour ramène donc au catalogue.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    // Requis par react-native-keyboard-controller (KeyboardAwareScrollView, KeyboardToolbar).
    <KeyboardProvider>
      <InventoryProvider>
        <Stack
          screenOptions={{
            // Nos écrans dessinent leur propre en-tête (composant Header de la maquette).
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]/index" />
          {/* Modale : simple option de présentation. Sur iOS, elle se ferme d'un geste vers le bas. */}
          <Stack.Screen name="product/[id]/edit" options={{ presentation: 'modal' }} />
        </Stack>
        {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
        <StatusBar style="light" />
      </InventoryProvider>
    </KeyboardProvider>
  );
}
