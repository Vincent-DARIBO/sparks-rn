import { render, screen, userEvent } from '@testing-library/react-native';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

import { UpdatesError } from '../../services/UpdatesError';

import UpdateStatus from '../UpdateStatus';

/**
 * expo-updates est remplacé par une doublure : le test choisit l'état que `useUpdates()` renvoie
 * (version intégrée, mise à jour disponible, en attente…) sans build ni serveur de mises à jour.
 */
jest.mock('expo-updates', () => ({
  isEnabled: true,
  useUpdates: jest.fn(),
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

const setUpdatesState = (state: Record<string, unknown>) =>
  jest.mocked(Updates.useUpdates).mockReturnValue({
    currentlyRunning: { isEmbeddedLaunch: true, channel: 'preview' },
    isUpdateAvailable: false,
    isUpdatePending: false,
    isChecking: false,
    isDownloading: false,
    ...state,
  } as ReturnType<typeof Updates.useUpdates>);

const setDev = (value: boolean) => Object.assign(globalThis, { __DEV__: value });

describe('UpdateStatus', () => {
  beforeEach(() => {
    setDev(false);
    jest.clearAllMocks();
  });
  afterEach(() => jest.restoreAllMocks());
  afterAll(() => setDev(true));

  it('affiche « Développement » sans bouton en développement', async () => {
    setDev(true);
    setUpdatesState({});
    await render(<UpdateStatus />);

    expect(screen.getByText('Développement')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('propose de rechercher une mise à jour sur la version intégrée', async () => {
    setUpdatesState({});
    await render(<UpdateStatus />);

    expect(screen.getByText('Version intégrée · canal preview')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Rechercher une mise à jour' })).toBeOnTheScreen();
  });

  it('propose de télécharger quand une mise à jour est disponible', async () => {
    setUpdatesState({ isUpdateAvailable: true });
    await render(<UpdateStatus />);

    expect(screen.getByRole('button', { name: 'Télécharger la mise à jour' })).toBeOnTheScreen();
  });

  it('ne lance rien quand on appuie pendant la recherche', async () => {
    setUpdatesState({ isChecking: true });
    await render(<UpdateStatus />);

    const button = screen.getByRole('button', { name: 'Recherche…' });
    await userEvent.press(button);

    expect(button).toBeDisabled();
    expect(Updates.checkForUpdateAsync).not.toHaveBeenCalled();
  });

  it('désactive le bouton pendant le téléchargement', async () => {
    setUpdatesState({ isUpdateAvailable: true, isDownloading: true });
    await render(<UpdateStatus />);

    expect(screen.getByRole('button', { name: 'Téléchargement…' })).toBeDisabled();
  });

  it('désactive le bouton pendant le redémarrage', async () => {
    setUpdatesState({ isUpdatePending: true, isRestarting: true });
    await render(<UpdateStatus />);

    expect(screen.getByRole('button', { name: 'Redémarrage…' })).toBeDisabled();
  });

  it('annonce que l’application est à jour quand la recherche ne trouve rien', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest.mocked(Updates.checkForUpdateAsync).mockResolvedValue({ isAvailable: false } as never);
    setUpdatesState({});
    await render(<UpdateStatus />);

    await userEvent.press(screen.getByRole('button', { name: 'Rechercher une mise à jour' }));

    expect(alert).toHaveBeenCalledWith('Mise à jour', 'Scan’Stock est à jour');
  });

  it("affiche le message utilisateur quand la recherche échoue", async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest.mocked(Updates.checkForUpdateAsync).mockRejectedValue(new Error('Network request failed'));
    setUpdatesState({});
    await render(<UpdateStatus />);

    await userEvent.press(screen.getByRole('button', { name: 'Rechercher une mise à jour' }));

    expect(alert).toHaveBeenCalledWith('Mise à jour', UpdatesError.checkFailed().userMessage);
  });

  it('remplace un canal vide par « — »', async () => {
    setUpdatesState({ currentlyRunning: { isEmbeddedLaunch: true, channel: '' } });
    await render(<UpdateStatus />);

    expect(screen.getByText('Version intégrée · canal —')).toBeOnTheScreen();
  });

  it("redémarre l'application quand la mise à jour est téléchargée", async () => {
    setUpdatesState({ isUpdateAvailable: true, isUpdatePending: true });
    await render(<UpdateStatus />);

    await userEvent.press(screen.getByRole('button', { name: 'Redémarrer pour appliquer' }));

    expect(Updates.reloadAsync).toHaveBeenCalledTimes(1);
  });

  it('affiche la date de la mise à jour reçue', async () => {
    const createdAt = new Date('2026-11-24T10:30:00');
    setUpdatesState({ currentlyRunning: { isEmbeddedLaunch: false, channel: 'preview', createdAt } });
    await render(<UpdateStatus />);

    expect(screen.getByText(`Mise à jour du ${createdAt.toLocaleString('fr-FR')} · canal preview`)).toBeOnTheScreen();
  });
});
