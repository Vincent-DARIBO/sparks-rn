/**
 * ÉTAPE 01 — Fondations
 *
 * Objectifs de la démonstration guidée D2 :
 *  1. Lancer l'application sur son téléphone avec Expo Go.
 *  2. Modifier ce fichier et constater le Fast Refresh (rechargement à chaud).
 *  3. Utiliser React Native DevTools : console, point d'arrêt, inspection.
 */
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { products } from './src/data/products';
import useDebugCounter from './src/hooks/useDebugCounter';

export default function App() {
  const { pressCount, handlePress } = useDebugCounter();

  // Valeur dérivée : on ne la stocke pas dans un état, on la recalcule à chaque rendu.
  const lowStockCount = products.filter((p) => p.quantity <= p.minQuantity).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan'Stock</Text>
      <Text style={styles.subtitle}>Gestion d'inventaire mobile</Text>

      <View style={styles.stats}>
        <Text style={styles.statLine}>{products.length} produits référencés</Text>
        <Text style={styles.statLine}>{lowStockCount} produits à réapprovisionner</Text>
      </View>

      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonLabel}>Tester le debugger ({pressCount})</Text>
      </Pressable>

      {/* Fond sombre → texte de la barre d'état en clair */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#61DAFB',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  stats: {
    marginVertical: 32,
    alignItems: 'center',
  },
  statLine: {
    fontSize: 16,
    color: '#C9D1D9',
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#61DAFB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#20232A',
    fontSize: 16,
    fontWeight: '600',
  },
});
