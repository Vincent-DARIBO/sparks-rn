import { useState } from 'react';
import { Alert, Linking } from 'react-native';

import { ProductLocationService } from '../services/ProductLocationService';
import type { ProductLocation } from '../types';
import useMediaErrorHandler from './useMediaErrorHandler';
import useUpdateProduct from './useUpdateProduct';

// Emplacement de stockage du produit : enregistré avec la position actuelle, affiché sur une carte.
export default function useProductLocation(productId: string) {
  const { updateProduct } = useUpdateProduct(productId);
  const { handleMediaError } = useMediaErrorHandler('Emplacement du produit');
  const [isLocating, setIsLocating] = useState(false);

  const recordCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const location = await ProductLocationService.locateDevice();
      await updateProduct({ location });
    } catch (error) {
      handleMediaError(error);
    } finally {
      setIsLocating(false);
    }
  };

  // URL « universelle » de Google Maps : elle ouvre l'application si elle est installée,
  // le navigateur sinon, sur Android comme sur iOS. Pas besoin de clé d'API.
  const openLocation = ({ latitude, longitude }: ProductLocation) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`).catch(() =>
      Alert.alert('Emplacement du produit', "Impossible d'ouvrir la carte."),
    );
  };

  return {
    recordCurrentLocation: () => void recordCurrentLocation(),
    openLocation,
    isLocating,
  };
}
