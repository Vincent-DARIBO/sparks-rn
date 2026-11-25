import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import useFormatters from '@/i18n/useFormatters';
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
  const { t } = useTranslation();
  const format = useFormatters();
  const { currentlyRunning, isUpdateAvailable, isUpdatePending, isChecking, isDownloading, isRestarting } =
    Updates.useUpdates();

  const isUpdatesEnabled = !__DEV__ && Updates.isEnabled;
  const isBusy = isChecking || isDownloading || isRestarting;

  // La date suit la langue active : « 24/11/2026 10:30:00 » en français, « 11/24/26, 10:30:00 AM » en anglais.
  const { createdAt } = currentlyRunning;
  const runningLabel = currentlyRunning.isEmbeddedLaunch
    ? t('settings.updateEmbedded')
    : t('settings.updateFrom', { date: createdAt ? format.dateTime(createdAt) : '—' });
  // `||` et non `??` : un canal vide ('') doit aussi afficher « — ».
  const statusLabel = isUpdatesEnabled
    ? t('settings.updateStatus', { running: runningLabel, channel: currentlyRunning.channel || '—' })
    : t('settings.updateDev');

  // Une seule action à la fois, par priorité : redémarrer > télécharger > rechercher.
  const idleActionLabel = isUpdatePending
    ? t('settings.updateRestart')
    : isUpdateAvailable
      ? t('settings.updateDownload')
      : t('settings.updateCheck');
  const busyActionLabel = isChecking
    ? t('settings.updateChecking')
    : isDownloading
      ? t('settings.updateDownloading')
      : t('settings.updateRestarting');

  const runAction = async () => {
    try {
      if (isUpdatePending) {
        await UpdatesService.applyUpdate();
      } else if (isUpdateAvailable) {
        await UpdatesService.downloadUpdate();
      } else if (!(await UpdatesService.checkForUpdate())) {
        Alert.alert(t('settings.update'), t('settings.updateUpToDate'));
      }
    } catch (error) {
      Alert.alert(t('settings.update'), getUserMessage(error));
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
