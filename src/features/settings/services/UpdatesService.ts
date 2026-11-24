import * as Updates from 'expo-updates';

import { UpdatesError } from './UpdatesError';

/** Pilote expo-updates, la bibliothèque qui recherche, télécharge et applique les mises à jour à distance. */
export class UpdatesService {
  /** Interroge le serveur. Renvoie `true` si une mise à jour est disponible. */
  static async checkForUpdate(): Promise<boolean> {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      return isAvailable;
    } catch (error) {
      throw UpdatesError.checkFailed(error);
    }
  }

  /** Télécharge la mise à jour trouvée : elle sera appliquée au prochain redémarrage. */
  static async downloadUpdate(): Promise<void> {
    try {
      await Updates.fetchUpdateAsync();
    } catch (error) {
      throw UpdatesError.downloadFailed(error);
    }
  }

  /** Redémarre l'application pour lancer la mise à jour téléchargée. */
  static async applyUpdate(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      throw UpdatesError.reloadFailed(error);
    }
  }
}
