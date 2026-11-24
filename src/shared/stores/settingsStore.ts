import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageService } from '@/shared/services/StorageService';

export type ThemeMode = 'system' | 'light' | 'dark';

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
  setThemeMode: (mode: ThemeMode) => void;
  setVibrateOnScan: (value: boolean) => void;
  setOpenAfterScan: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      vibrateOnScan: true,
      openAfterScan: false,
      setThemeMode: (themeMode) => set({ themeMode }),
      setVibrateOnScan: (vibrateOnScan) => set({ vibrateOnScan }),
      setOpenAfterScan: (openAfterScan) => set({ openAfterScan }),
    }),
    {
      name: 'scanstock-settings',
      storage: createJSONStorage(() => StorageService),
      // `partialize` choisit ce qui est enregistré : les données, pas les fonctions.
      partialize: ({ themeMode, vibrateOnScan, openAfterScan }) => ({ themeMode, vibrateOnScan, openAfterScan }),
    },
  ),
);
