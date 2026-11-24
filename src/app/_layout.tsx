/**
 * ÉTAPE 07 — Données et gestion d'état
 *
 * Layout racine : il enveloppe TOUTES les routes de l'application.
 *  - fournit le cache des données serveur (QueryClientProvider, TanStack Query, Module 7) ;
 *  - fournit le suivi du clavier (KeyboardProvider, ajouté au Module 6) ;
 *  - fournit les favoris (FavoritesProvider) ;
 *  - déclare une pile (Stack) : les onglets, la fiche produit, la modale de modification.
 *
 * Expo Router fournit déjà le SafeAreaProvider : inutile de l'ajouter.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import FavoritesProvider from '@/features/products/FavoritesProvider';
import { queryClient } from '@/shared/api/queryClient';
import { useTheme } from '@/theme';

// Route d'ancrage de la pile : si l'app s'ouvre directement sur une fiche (lien profond),
// les onglets sont placés dessous, et le retour ramène donc au catalogue.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    // Le client est créé hors du composant (queryClient.ts) : un seul cache pour toute l'app.
    <QueryClientProvider client={queryClient}>
      {/* Requis par react-native-keyboard-controller (KeyboardAwareScrollView, KeyboardToolbar). */}
      <KeyboardProvider>
        <FavoritesProvider>
          <Stack
            screenOptions={{
              // Nos écrans dessinent leur propre en-tête (composant Header de la maquette).
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="product/[id]/index" />
            {/* Modales : simple option de présentation. Sur iOS, elles se ferment d'un geste vers le bas. */}
            <Stack.Screen name="product/[id]/edit" options={{ presentation: 'modal' }} />
            <Stack.Screen name="product/new" options={{ presentation: 'modal' }} />
          </Stack>
          {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
          <StatusBar style="light" />
        </FavoritesProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
