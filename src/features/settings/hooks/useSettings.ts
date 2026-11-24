import Constants from 'expo-constants';

import { useSettingsStore, type ThemeMode } from '@/shared/stores/settingsStore';

export const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Système' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
];

// « 58.0.0 » → « 58 ». Lue dans la configuration de l'app (app.json + package.json) au moment du build.
const sdkMajorVersion = Constants.expoConfig?.sdkVersion?.split('.')[0] ?? '—';
const versionLabel = `${Constants.expoConfig?.version ?? '—'} · SDK ${sdkMajorVersion}`;

/**
 * Hook de l'écran Réglages. Chaque changement est enregistré immédiatement (`persist`).
 * Un sélecteur par valeur : l'écran ne se re-rend que pour ce qu'il affiche.
 */
export default function useSettings() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const vibrateOnScan = useSettingsStore((state) => state.vibrateOnScan);
  const setVibrateOnScan = useSettingsStore((state) => state.setVibrateOnScan);
  const openAfterScan = useSettingsStore((state) => state.openAfterScan);
  const setOpenAfterScan = useSettingsStore((state) => state.setOpenAfterScan);

  return {
    themeMode,
    setThemeMode,
    vibrateOnScan,
    setVibrateOnScan,
    openAfterScan,
    setOpenAfterScan,
    versionLabel,
  };
}
