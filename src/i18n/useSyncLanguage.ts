import { useLocales } from 'expo-localization';
import { useEffect } from 'react';

import { useSettingsStore } from '@/shared/stores/settingsStore';

import i18n, { resolveLanguage } from './index';

/**
 * Applique la langue : celle choisie dans les Réglages, ou celle du téléphone (« Système »).
 * `useLocales()` re-rend le composant quand l'utilisateur change la langue du téléphone
 * pendant que l'application tourne (Android).
 */
export default function useSyncLanguage() {
  const preference = useSettingsStore((state) => state.language);
  const locales = useLocales();

  useEffect(() => {
    const language = resolveLanguage(preference, locales);
    // i18next signale un changement même pour la même langue : on évite un re-rendu inutile au démarrage.
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [preference, locales]);
}
