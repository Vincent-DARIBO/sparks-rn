import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

import { getUserMessage } from '@/shared/errors/getUserMessage';

import { UpdatesService } from '../services/UpdatesService';

/**
 * Ligne « Mise à jour » des Réglages : quel JavaScript tourne, et comment le renouveler.
 *
 * expo-updates cherche une mise à jour au lancement et l'applique au lancement SUIVANT ;
 * l'action permet d'aller plus vite. En développement (Expo Go compris), le JavaScript
 * vient de Metro : expo-updates n'a rien à proposer, `isEnabled` n'y est pas fiable.
 */
export default function useUpdateStatus() {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending, isChecking, isDownloading, isRestarting } =
    Updates.useUpdates();

  const isUpdatesEnabled = !__DEV__ && Updates.isEnabled;
  const isBusy = isChecking || isDownloading || isRestarting;

  const runningLabel = currentlyRunning.isEmbeddedLaunch
    ? 'Version intégrée'
    : `Mise à jour du ${currentlyRunning.createdAt?.toLocaleString('fr-FR') ?? '—'}`;
  // `||` et non `??` : un canal vide ('') doit aussi afficher « — ».
  const statusLabel = isUpdatesEnabled ? `${runningLabel} · canal ${currentlyRunning.channel || '—'}` : 'Développement';

  // Une seule action à la fois, par priorité : redémarrer > télécharger > rechercher.
  const idleActionLabel = isUpdatePending
    ? 'Redémarrer pour appliquer'
    : isUpdateAvailable
      ? 'Télécharger la mise à jour'
      : 'Rechercher une mise à jour';
  const busyActionLabel = isChecking ? 'Recherche…' : isDownloading ? 'Téléchargement…' : 'Redémarrage…';

  const runAction = async () => {
    try {
      if (isUpdatePending) {
        await UpdatesService.applyUpdate();
      } else if (isUpdateAvailable) {
        await UpdatesService.downloadUpdate();
      } else if (!(await UpdatesService.checkForUpdate())) {
        Alert.alert('Mise à jour', 'Scan’Stock est à jour');
      }
    } catch (error) {
      Alert.alert('Mise à jour', getUserMessage(error));
    }
  };

  return {
    isUpdatesEnabled,
    statusLabel,
    actionLabel: isBusy ? busyActionLabel : idleActionLabel,
    isBusy,
    runAction,
  };
}
