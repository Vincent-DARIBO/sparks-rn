import * as Updates from 'expo-updates';

import { UpdatesService } from '../UpdatesService';

// Doublure modifiable : chaque test règle les constantes d'expo-updates qu'il veut simuler.
jest.mock('expo-updates', () => ({ isEnabled: true, isEmbeddedLaunch: true, channel: 'preview' }));

const mockedUpdates = Updates as { isEnabled: boolean; isEmbeddedLaunch: boolean; channel: string | null };

// __DEV__ est une constante globale de React Native : on la réécrit sur `globalThis`.
const setDev = (value: boolean) => Object.assign(globalThis, { __DEV__: value });

describe('UpdatesService.getStatusLabel', () => {
  afterEach(() => {
    setDev(false);
  });

  it('affiche « Développement » en développement', () => {
    setDev(true);
    expect(UpdatesService.getStatusLabel()).toBe('Développement');
  });

  it('affiche la version intégrée et son canal', () => {
    setDev(false);
    expect(UpdatesService.getStatusLabel()).toBe('Version intégrée · canal preview');
  });

  it('remplace un canal vide par « — »', () => {
    setDev(false);
    mockedUpdates.channel = '';
    expect(UpdatesService.getStatusLabel()).toBe('Version intégrée · canal —');
  });
});
