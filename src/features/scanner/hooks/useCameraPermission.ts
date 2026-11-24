import { useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';
import { AppState, Linking } from 'react-native';

/**
 * Autorisation de l'appareil photo.
 *
 * `permission` vaut `null` tant que le système n'a pas répondu : on ne sait pas encore.
 * `canAskAgain` dit si le système accepte d'afficher sa demande. Après un refus définitif
 * (un seul refus sur iOS ; deux refus sur Android depuis la version 11), il vaut `false` :
 * appeler `requestPermission` ne ferait plus rien, seuls les réglages du téléphone permettent de revenir en arrière.
 */
export default function useCameraPermission() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  // Retour des réglages, surtout utile sur Android : l'app y continue de tourner et l'onglet est resté monté,
  // on relit donc l'autorisation que l'utilisateur vient peut-être d'accorder.
  // (Sur iOS, modifier l'autorisation dans les réglages relance l'app : l'autorisation est relue au démarrage.)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void getPermission();
    });
    return () => subscription.remove();
  }, [getPermission]);

  const canAskAgain = permission?.canAskAgain ?? true;

  const askOrOpenSettings = () => {
    if (canAskAgain) {
      void requestPermission();
      return;
    }
    void Linking.openSettings();
  };

  return {
    isPermissionKnown: permission !== null,
    isPermissionGranted: permission?.granted ?? false,
    canAskAgain,
    askOrOpenSettings,
  };
}
