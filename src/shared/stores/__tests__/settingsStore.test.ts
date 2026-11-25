import { StorageService } from '@/shared/services/StorageService';

import { useSettingsStore } from '../settingsStore';

describe('settingsStore', () => {
  // Le store est un module partagé par tous les tests du fichier : sans remise à zéro, la langue
  // choisie par un test resterait dans le suivant (`rehydrate` fusionne SUR l'état courant).
  beforeEach(() => {
    StorageService.removeItem('scanstock-settings');
    useSettingsStore.setState(useSettingsStore.getInitialState(), true);
  });

  it('donne « Système » à un utilisateur dont les réglages enregistrés n’ont pas de langue', async () => {
    // État enregistré par une version de l'application antérieure à l'ajout de la langue.
    StorageService.setItem('scanstock-settings', JSON.stringify({ state: { themeMode: 'dark' }, version: 0 }));

    await useSettingsStore.persist.rehydrate();

    expect(useSettingsStore.getState().themeMode).toBe('dark');
    expect(useSettingsStore.getState().language).toBe('system');
  });

  it('enregistre la langue choisie pour le prochain lancement', () => {
    useSettingsStore.getState().setLanguage('en');

    const saved = JSON.parse(StorageService.getItem('scanstock-settings') ?? '{}');
    expect(saved.state.language).toBe('en');
  });
});
