import { Alert, Linking } from 'react-native';

import { ProductMediaError } from '../services/ProductMediaError';

/**
 * Affiche les erreurs des fonctionnalités natives (photo, position). Partagé par les deux hooks.
 *
 * Autorisation refusée (appareil photo ou position) : après un refus, le système ne redemande plus ;
 * seul l'utilisateur peut la rétablir dans les réglages, d'où le bouton qui les ouvre.
 * Autre erreur : une alerte simple, avec `title` pour titre.
 * Toute autre erreur (échec du serveur) est déjà signalée par l'alerte globale des mutations.
 */
export default function useMediaErrorHandler(title: string) {
  const handleMediaError = (error: unknown) => {
    if (!(error instanceof ProductMediaError)) return;
    if (error.code === 'permission_denied') {
      Alert.alert(error.message, error.userMessage, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Ouvrir les réglages', onPress: () => void Linking.openSettings() },
      ]);
      return;
    }
    Alert.alert(title, error.userMessage);
  };

  return { handleMediaError };
}
