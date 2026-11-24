import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { ProductMediaError } from './ProductMediaError';

export type PhotoSource = 'camera' | 'library';

// Recadrage 16:9, comme l'illustration de la fiche (sur iOS, le cadre de recadrage
// du système reste carré : la fiche recadre alors l'image à l'affichage).
const PHOTO_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [16, 9],
  quality: 0.7,
};

// Photo d'un produit : appareil photo ou galerie, puis copie dans les fichiers de l'application.
export class ProductPhotoService {
  // Renvoie l'adresse (file://…) de la copie, ou null si l'utilisateur ferme le sélecteur.
  static async pick(productId: string, source: PhotoSource): Promise<string | null> {
    try {
      // La galerie ne demande aucune autorisation : c'est le sélecteur du SYSTÈME qui s'affiche,
      // et l'app ne reçoit que la photo choisie, jamais l'accès à toute la photothèque.
      const result = source === 'camera' ? await takePhoto() : await ImagePicker.launchImageLibraryAsync(PHOTO_OPTIONS);
      if (result.canceled) return null;

      // Le fichier renvoyé par le sélecteur est dans un CACHE que le système peut vider à tout moment,
      // et une photo de galerie peut être supprimée par l'utilisateur : on en garde notre propre copie.
      // `Paths.document` est le dossier « Documents » de l'application : le système ne le vide jamais.
      // Nom unique par produit ET par prise : une nouvelle photo a une nouvelle adresse,
      // sinon le cache d'images afficherait encore l'ancienne.
      // Limites connues : l'ancienne photo, et la copie d'un enregistrement raté sur le serveur,
      // ne sont pas supprimées ; le fichier est nommé .jpg même si l'image d'origine est un PNG.
      const copy = new File(Paths.document, `product-${productId}-${Date.now()}.jpg`);
      await new File(result.assets[0].uri).copy(copy);
      return copy.uri;
    } catch (error) {
      if (error instanceof ProductMediaError) throw error;
      throw ProductMediaError.photoFailed(error);
    }
  }
}

async function takePhoto(): Promise<ImagePicker.ImagePickerResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) throw ProductMediaError.permissionDenied("à l'appareil photo", permission);
  try {
    return await ImagePicker.launchCameraAsync(PHOTO_OPTIONS);
  } catch (error) {
    // Appareil sans caméra utilisable : le lancement échoue.
    throw ProductMediaError.cameraUnavailable(error);
  }
}
