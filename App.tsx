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
 */
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';

import Header from './src/components/Header';
import ProductCard from './src/components/ProductCard';
import { products } from './src/data/products';
import useCatalog from './src/hooks/useCatalog';
import { useThemedStyles, type Theme } from './src/theme';

export default function App() {
  // L'état des favoris vit dans le parent commun à l'en-tête et aux cartes.
  // « Pâte à tartiner 400 g » (id '1') est en favori au lancement.
  const { toggleFavorite, isFavorite, favoritesLabel } = useCatalog(['1']);
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <Header title="Scan'Stock" subtitle={favoritesLabel} />

      {/* Une View ne défile pas : ScrollView suffit pour 12 éléments ; FlatList / FlashList au Module 4 */}
      <ScrollView contentContainerStyle={styles.list}>
        {products.map((product) => (
          // `key` : identifiant stable pour que React suive chaque élément.
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </ScrollView>

      {/* L'en-tête reste sombre dans les deux thèmes → texte de la barre d'état toujours en clair */}
      <StatusBar style="light" />
    </View>
  );
}

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      padding: spacing.lg,
    },
  });
