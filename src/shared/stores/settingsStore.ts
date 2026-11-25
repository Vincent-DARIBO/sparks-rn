import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Language } from '@/i18n';
import { StorageService } from '@/shared/services/StorageService';

export type ThemeMode = 'system' | 'light' | 'dark';
// « system » : la langue du téléphone.
export type LanguagePreference = 'system' | Language;

/**
 * Préférences de l'utilisateur, enregistrées sur l'appareil.
 *
 * Store PARTAGÉ (dans `src/shared`, pas dans `features/settings`) : l'écran Réglages
 * les modifie, mais le thème (`src/theme`) et, au Module 8, le scanner les lisent.
 * Ni le thème ni une autre fonctionnalité n'ont ainsi à importer `features/settings`.
 */
interface SettingsState {
  themeMode: ThemeMode;
  // Vibration quand un code-barres est lu (Module 8).
  vibrateOnScan: boolean;
  // Ouvrir directement la fiche du produit scanné (Module 8).
  openAfterScan: boolean;
  language: LanguagePreference;
  setThemeMode: (mode: ThemeMode) => void;
  setVibrateOnScan: (value: boolean) => void;
  setOpenAfterScan: (value: boolean) => void;
  setLanguage: (language: LanguagePreference) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      vibrateOnScan: true,
      openAfterScan: false,
      // Un état enregistré avant l'ajout de ce champ ne le contient pas : `persist` fusionne l'état
      // enregistré avec ces valeurs de départ, l'utilisateur existant obtient donc « system ».
      language: 'system',
      setThemeMode: (themeMode) => set({ themeMode }),
      setVibrateOnScan: (vibrateOnScan) => set({ vibrateOnScan }),
      setOpenAfterScan: (openAfterScan) => set({ openAfterScan }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'scanstock-settings',
      storage: createJSONStorage(() => StorageService),
      // `partialize` choisit ce qui est enregistré : les données, pas les fonctions.
      partialize: ({ themeMode, vibrateOnScan, openAfterScan, language }) => ({
        themeMode,
        vibrateOnScan,
        openAfterScan,
        language,
      }),
    },
  ),
);
