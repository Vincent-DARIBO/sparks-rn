import type { AccessibilityActionEvent } from 'react-native';

import { useIsFavorite, useToggleFavorite } from '../stores/favoritesStore';
import type { Product } from '../types';
import { confirmDeleteProduct } from '../utils/confirmDeleteProduct';
import { getProductAccessibilityLabel } from '../utils/productAccessibility';
import { getStockStatus } from '../utils/stock';

interface UseProductCardParams {
  product: Product;
  onAdjustQuantity: (id: string, delta: number) => void;
  onPress: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Logique de la carte produit : stock, favori, et accessibilité.
 *
 * Avec un lecteur d'écran, la carte est UN seul élément : il lit une phrase
 * (« Soda cola 33 cl, Coca-Cola, Stock bas, 6 unités »), puis propose des ACTIONS
 * (VoiceOver : rotor « Actions », balayage haut/bas ; TalkBack : menu des actions)
 * à la place des boutons −, + et ★ qu'il faudrait sinon parcourir un par un.
 */
export default function useProductCard(params: UseProductCardParams) {
  const { product, onAdjustQuantity, onPress, onDelete } = params;
  const isFavorite = useIsFavorite(product.id);
  const toggleFavorite = useToggleFavorite();
  const status = getStockStatus(product.quantity, product.minQuantity);

  const accessibilityLabel = getProductAccessibilityLabel(product, isFavorite);

  // `activate` : le double appui du lecteur d'écran (ouvre la fiche). Les noms `add`, `remove`,
  // `favorite` et `delete` sont les nôtres ; le texte lu à l'utilisateur est le `label`.
  // `delete` n'est proposée que si la carte est supprimable : même chemin que le glissement (SCAN-18).
  const accessibilityActions = [
    { name: 'activate', label: 'Ouvrir la fiche' },
    { name: 'add', label: 'Ajouter une unité' },
    { name: 'remove', label: 'Retirer une unité' },
    { name: 'favorite', label: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' },
    ...(onDelete ? [{ name: 'delete', label: 'Supprimer' }] : []),
  ];

  // Les bornes (0 et MAX_QUANTITY) sont déjà gérées par `onAdjustQuantity`.
  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case 'activate':
        return onPress(product.id);
      case 'add':
        return onAdjustQuantity(product.id, 1);
      case 'remove':
        return onAdjustQuantity(product.id, -1);
      case 'favorite':
        return toggleFavorite(product.id);
      case 'delete':
        // Même confirmation (avec « Annuler ») que « glisser pour supprimer ».
        return onDelete && confirmDeleteProduct(product, onDelete);
    }
  };

  return { status, isFavorite, toggleFavorite, accessibilityLabel, accessibilityActions, handleAccessibilityAction };
}
