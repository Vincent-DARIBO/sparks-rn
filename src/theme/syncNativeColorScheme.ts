import { Appearance } from 'react-native';

import { useSettingsStore, type ThemeMode } from '@/shared/stores/settingsStore';

let isSubscribed = false;

const applyThemeMode = (mode: ThemeMode) => Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);

/**
 * `useTheme` colore NOS composants. Mais une partie de l'interface est dessinée par
 * le système : feuilles modales iOS, clavier, alertes, indicateur de tirage, icônes
 * de la barre d'état en `style="auto"`. Elle suit le thème du TÉLÉPHONE.
 * `Appearance.setColorScheme` impose notre choix à toute l'application native
 * ('unspecified' rend la main au téléphone pour « Système »).
 *
 * Appelée une fois, hors de tout composant : le choix enregistré est appliqué avant
 * le premier affichage, puis à chaque changement (`subscribe` réagit au store
 * sans passer par un rendu React). L'abonnement n'est jamais retiré : il vit aussi
 * longtemps que l'application. La garde évite qu'un rechargement à chaud de `_layout.tsx`,
 * en développement, en ajoute un deuxième.
 */
export function syncNativeColorScheme() {
  if (isSubscribed) return;
  isSubscribed = true;
  applyThemeMode(useSettingsStore.getState().themeMode);
  useSettingsStore.subscribe((state, previousState) => {
    if (state.themeMode !== previousState.themeMode) {
      applyThemeMode(state.themeMode);
    }
  });
}
