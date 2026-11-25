import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';

import { ProductMediaError } from '../services/ProductMediaError';

/**
 * Affiche les erreurs des fonctionnalités natives (photo, position). Partagé par les deux hooks.
 *
 * Autorisation refusée (appareil photo ou position) : après un refus, le système ne redemande plus ;
 * seul l'utilisateur peut la rétablir dans les réglages, d'où le bouton qui les ouvre.
 * Le titre et le message de cette alerte sont traduits ici, à partir du code de l'erreur, et non repris
 * de `ProductMediaError` (en français seulement). `permission` dit quelle autorisation a été refusée.
 * Autre erreur : une alerte simple, avec `title` pour titre.
 * Toute autre erreur (échec du serveur) est déjà signalée par l'alerte globale des mutations.
 */
export default function useMediaErrorHandler(title: string, permission: 'camera' | 'location') {
  const { t } = useTranslation();

  const handleMediaError = (error: unknown) => {
    if (!(error instanceof ProductMediaError)) return;
    if (error.code === 'permission_denied') {
      const what = t(permission === 'camera' ? 'product.permissionCamera' : 'product.permissionLocation');
      Alert.alert(t('product.permissionDeniedTitle', { what }), t('product.permissionDeniedMessage', { what }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('product.openSettings'), onPress: () => void Linking.openSettings() },
      ]);
      return;
    }
    Alert.alert(title, error.userMessage);
  };

  return { handleMediaError };
}
