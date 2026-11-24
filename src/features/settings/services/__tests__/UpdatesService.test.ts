import * as Updates from 'expo-updates';

import { UpdatesService } from '../UpdatesService';

jest.mock('expo-updates', () => ({
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}));

describe('UpdatesService', () => {
  it("renvoie si une mise à jour est disponible", async () => {
    jest.mocked(Updates.checkForUpdateAsync).mockResolvedValue({ isAvailable: false } as never);

    await expect(UpdatesService.checkForUpdate()).resolves.toBe(false);
  });

  // Chaque méthode transforme l'échec d'expo-updates en UpdatesError, avec son propre code.
  it.each([
    ['checkForUpdate', Updates.checkForUpdateAsync, 'check_failed'],
    ['downloadUpdate', Updates.fetchUpdateAsync, 'download_failed'],
    ['applyUpdate', Updates.reloadAsync, 'reload_failed'],
  ] as const)('%s lève une UpdatesError « %s » en cas d’échec', async (method, expoUpdatesFn, code) => {
    jest.mocked(expoUpdatesFn).mockRejectedValue(new Error('Network request failed'));

    await expect(UpdatesService[method]()).rejects.toMatchObject({ name: 'UpdatesError', code });
  });
});
