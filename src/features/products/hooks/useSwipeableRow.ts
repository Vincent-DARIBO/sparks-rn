import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import type { Product } from '../types';
import { confirmDeleteProduct } from '../utils/confirmDeleteProduct';

// Donne accès à la ligne glissable, la referme au recyclage et gère « Supprimer » (fermer puis confirmer).
export default function useSwipeableRow(product: Product, onDelete: (id: string) => void) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { t } = useTranslation();

  // FlashList RECYCLE les cellules : la même ligne glissable sert successivement à plusieurs produits,
  // avec son état d'ouverture. Une carte laissée ouverte réapparaîtrait donc ouverte sur un AUTRE produit.
  // `reset()` referme sans animation (contrairement à `close()`), avant l'affichage : le nouveau produit
  // apparaît fermé, à un éventuel éclair près (la valeur partagée est appliquée de façon asynchrone sur le thread UI).
  // Limite connue : `reset()` ne remet pas tout l'état interne à zéro (en 3.3.0, il ne touche pas au geste d'appui qui sert à refermer).
  useLayoutEffect(() => {
    swipeableRef.current?.reset();
  }, [product.id]);

  // On referme la carte AVANT la confirmation : « Annuler » la laisse donc fermée.
  const closeAndDelete = () => {
    swipeableRef.current?.close();
    confirmDeleteProduct(product, onDelete, t);
  };

  return { swipeableRef, closeAndDelete };
}
