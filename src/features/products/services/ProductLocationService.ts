import * as Location from 'expo-location';

import type { ProductLocation } from '../types';
import { ProductMediaError } from './ProductMediaError';

// Emplacement de stockage d'un produit : position actuelle du téléphone + adresse lisible.
export class ProductLocationService {
  static async locateDevice(): Promise<ProductLocation> {
    try {
      // Autorisation « au premier plan » uniquement : la position n'est lue que lorsque
      // l'utilisateur appuie sur le bouton, app ouverte. Demander l'accès « en arrière-plan »
      // serait injustifié (et refusé par les stores sans vraie raison).
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) throw ProductMediaError.permissionDenied('à la position', permission);

      // Précision « Balanced » (une centaine de mètres) : suffisante pour un magasin, et plus rapide.
      // Limite connue : aucun délai maximal ; sans signal, l'indicateur tourne jusqu'à la réponse du système.
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: await getReadableAddress(coords),
        recordedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ProductMediaError) throw error;
      throw ProductMediaError.locationFailed(error);
    }
  }
}

// Géocodage inverse : coordonnées → adresse. Il échoue sans réseau et peut renvoyer des champs vides :
// dans ces cas, on affiche les coordonnées, pour que la ligne « Emplacement » ne soit jamais vide.
async function getReadableAddress({ latitude, longitude }: Location.LocationObjectCoords): Promise<string> {
  const [address] = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => []);
  const label = [address?.name, address?.city].filter(Boolean).join(', ');
  return label || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}
