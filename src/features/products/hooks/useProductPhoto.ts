import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { ProductPhotoService, type PhotoSource } from '../services/ProductPhotoService';
import useMediaErrorHandler from './useMediaErrorHandler';
import useUpdateProduct from './useUpdateProduct';

// Photo d'un produit : appareil photo ou galerie, au choix de l'utilisateur.
export default function useProductPhoto(productId: string) {
  const { updateProduct } = useUpdateProduct(productId);
  const { t } = useTranslation();
  const { handleMediaError } = useMediaErrorHandler(t('product.photoTitle'), 'camera');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const pickFrom = async (source: PhotoSource) => {
    setIsSavingPhoto(true);
    try {
      const photoUri = await ProductPhotoService.pick(productId, source);
      // null : sélecteur fermé par l'utilisateur, il n'y a rien à faire.
      if (photoUri) await updateProduct({ photoUri });
    } catch (error) {
      handleMediaError(error);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const choosePhoto = () => {
    Alert.alert(t('product.photoTitle'), undefined, [
      { text: t('product.takePhoto'), onPress: () => void pickFrom('camera') },
      { text: t('product.chooseFromLibrary'), onPress: () => void pickFrom('library') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  return { choosePhoto, isSavingPhoto };
}
