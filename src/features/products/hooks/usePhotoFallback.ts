import { useState } from 'react';

/**
 * La photo est un fichier propre au téléphone qui l'a prise : sur un autre téléphone, ou après
 * une réinstallation, il n'existe pas. Si l'image ne se charge pas, on revient à l'illustration
 * par défaut plutôt que d'afficher un cadre vide.
 *
 * On retient l'ADRESSE qui a échoué (et non un simple booléen) : quand FlashList recycle la vignette
 * pour un autre produit, l'adresse change et la nouvelle photo est tentée normalement.
 */
export default function usePhotoFallback(photoUri: string | undefined) {
  const [failedUri, setFailedUri] = useState<string>();

  return {
    showPhoto: photoUri !== undefined && photoUri !== failedUri,
    handlePhotoError: () => setFailedUri(photoUri),
  };
}
