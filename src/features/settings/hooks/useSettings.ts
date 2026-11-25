import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

import { useSettingsStore, type LanguagePreference, type ThemeMode } from '@/shared/stores/settingsStore';

// « 58.0.0 » → « 58 ». Lue dans la configuration de l'app (app.json + package.json) au moment du build.
const sdkMajorVersion = Constants.expoConfig?.sdkVersion?.split('.')[0] ?? '—';
const versionLabel = `${Constants.expoConfig?.version ?? '—'} · SDK ${sdkMajorVersion}`;

/**
 * Hook de l'écran Réglages. Chaque changement est enregistré immédiatement (`persist`).
 * Un sélecteur par valeur : l'écran ne se re-rend que pour ce qu'il affiche.
 */
export default function useSettings() {
  const { t } = useTranslation();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const vibrateOnScan = useSettingsStore((state) => state.vibrateOnScan);
  const setVibrateOnScan = useSettingsStore((state) => state.setVibrateOnScan);
  const openAfterScan = useSettingsStore((state) => state.openAfterScan);
  const setOpenAfterScan = useSettingsStore((state) => state.setOpenAfterScan);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];
  // Chaque langue s'écrit DANS sa propre langue : on la reconnaît même quand l'interface est dans une autre.
  const languageOptions: { value: LanguagePreference; label: string }[] = [
    { value: 'system', label: t('settings.languageSystem') },
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
  ];

  return {
    themeOptions,
    themeMode,
    setThemeMode,
    languageOptions,
    language,
    setLanguage,
    vibrateOnScan,
    setVibrateOnScan,
    openAfterScan,
    setOpenAfterScan,
    versionLabel,
  };
}
