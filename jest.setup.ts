/**
 * Préparation commune à tous les tests (chargée par Jest avant chaque fichier de test).
 *
 * Les tests tournent dans Node, pas sur un téléphone : les modules natifs (zones sûres,
 * clavier, SQLite) n'y existent pas. On les remplace ici par des
 * doublures (« mocks »), déclarées UNE SEULE FOIS pour tous les tests.
 * Quand une bibliothèque fournit sa propre doublure Jest, on l'utilise plutôt que d'en écrire une.
 * Pas de doublure pour les icônes (@expo/vector-icons) : jest-expo s'en charge déjà.
 */
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

// Doublure fournie par react-native-safe-area-context : des marges à 0.
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// `require` (et non `import`) : jest.mock est remonté en tête de fichier, avant les imports,
// donc la fabrique ne peut charger la doublure qu'au moment où elle est appelée.
// Doublure fournie par react-native-keyboard-controller : KeyboardAwareScrollView, KeyboardToolbar…
jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'));

// Stockage clé-valeur en mémoire : le store des réglages (thème) lit le stockage dès son import,
// et expo-sqlite est natif. Une Map suffit, vidée à chaque lancement de Jest.
jest.mock('@/shared/services/StorageService', () => {
  const memory = new Map<string, string>();
  return {
    StorageService: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => void memory.set(key, value),
      removeItem: (key: string) => void memory.delete(key),
    },
  };
});
