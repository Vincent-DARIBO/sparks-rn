import { useRef } from 'react';
import { AccessibilityInfo, type AccessibilityActionEvent } from 'react-native';

import { MAX_QUANTITY, type Product } from '../types';
import { formatUnits } from '../utils/productAccessibility';
import { clampQuantity, getStockStatus } from '../utils/stock';

/**
 * Boutons − / + d'un produit, branchés sur les données du serveur.
 *
 * Remplace `useStock` du Jour 1 : le hook ne stocke plus la quantité, il lit
 * `product.quantity` et signale les changements au parent par `onAdjustQuantity`.
 */
export default function useProductQuantity(
  product: Product,
  onAdjustQuantity: (id: string, delta: number) => void,
) {
  // useRef : quantité au premier affichage, mémorisée SANS nouveau rendu.
  // « Annuler » sur la fiche y revient.
  const initialQuantityRef = useRef(product.quantity);

  const increment = () => onAdjustQuantity(product.id, 1);
  const decrement = () => onAdjustQuantity(product.id, -1);
  const reset = () => onAdjustQuantity(product.id, initialQuantityRef.current - product.quantity);

  // Accessibilité : la quantité est un élément « réglable ». VoiceOver : balayer vers le haut / le bas ;
  // TalkBack : le menu des actions. Le système envoie `increment` ou `decrement`.
  const handleQuantityAccessibilityAction = (event: AccessibilityActionEvent) => {
    const delta = event.nativeEvent.actionName === 'increment' ? 1 : -1;
    const newQuantity = clampQuantity(product.quantity + delta);
    if (newQuantity === product.quantity) return;
    onAdjustQuantity(product.id, delta);
    // La `accessibilityValue` est mise à jour par le système de façon asynchrone, et ni iOS ni Android
    // n'annoncent seuls son changement : on dit la quantité à la main, sur les deux plateformes.
    AccessibilityInfo.announceForAccessibility(formatUnits(newQuantity));
  };

  return {
    quantityAccessibilityValue: { min: 0, max: MAX_QUANTITY, now: product.quantity, text: formatUnits(product.quantity) },
    handleQuantityAccessibilityAction,
    quantity: product.quantity,
    status: getStockStatus(product.quantity, product.minQuantity), // valeur dérivée, pas un état
    increment,
    decrement,
    reset,
  };
}
