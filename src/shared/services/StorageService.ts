import Storage from 'expo-sqlite/kv-store';

import { StorageError } from './StorageError';

/**
 * Stockage clé-valeur persistant, utilisé par les stores Zustand (middleware `persist`).
 *
 * Ses trois méthodes respectent l'interface `StateStorage` de Zustand
 * (getItem / setItem / removeItem) : les stores ne savent pas QUELLE technologie
 * enregistre les données. Ici expo-sqlite/kv-store, inclus dans Expo Go ;
 * pour passer à MMKV (Module 8), seul ce fichier changera, pas les stores.
 *
 * Méthodes SYNCHRONES : Zustand relit l'état enregistré dès la création du store,
 * avant le premier affichage. Avec une lecture asynchrone, l'app afficherait un
 * instant les valeurs par défaut (thème clair, favoris de départ) avant les vraies.
 */
export class StorageService {
  static getItem(key: string): string | null {
    try {
      return Storage.getItemSync(key);
    } catch (error) {
      throw StorageError.readFailed(error);
    }
  }

  static setItem(key: string, value: string): void {
    try {
      Storage.setItemSync(key, value);
    } catch (error) {
      throw StorageError.writeFailed(error);
    }
  }

  static removeItem(key: string): void {
    try {
      Storage.removeItemSync(key);
    } catch (error) {
      throw StorageError.removeFailed(error);
    }
  }
}
