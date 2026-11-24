/**
 * ÉTAPE 02 — TypeScript et React
 *
 * SCAN-01 : types métier (src/types), fonction pure de statut (src/utils)
 * et composants typés (src/components) pour afficher le catalogue.
 * SCAN-02 : hooks personnalisés (src/hooks) : useStock (état local d'une carte),
 * useToggleSet (générique), useFavorites et useCatalog (useEffect).
 *
 * ÉTAPE 03 — Styles et mise en page
 *
 * SCAN-03 : thème clair / sombre qui suit le réglage du téléphone (src/theme).
 * Couleurs, espacements et tailles de texte sont centralisés dans des jetons.
 * SCAN-04 : safe areas (react-native-safe-area-context) et écran d'accueil
 * responsive (src/screens) : tuiles de statistiques, 1 ou 2 colonnes.
 */
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { products } from './src/data/products';
import useCatalog from './src/hooks/useCatalog';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  // L'état des favoris vit dans le parent commun à l'en-tête et aux cartes.
  // « Pâte à tartiner 400 g » (id '1') est en favori au lancement.
  const { toggleFavorite, isFavorite, favoritesLabel } = useCatalog(['1']);

  return (
    // Fournit les dimensions des zones sûres à tous les composants enfants.
    <SafeAreaProvider>
      <HomeScreen
        products={products}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        favoritesLabel={favoritesLabel}
      />

      {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
