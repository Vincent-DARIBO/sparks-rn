import { Alert } from 'react-native';

import type { Product } from '../types';

// Toute action destructrice se confirme : on ne supprime pas sur un simple geste.
export function confirmDeleteProduct(product: Product, onConfirm: (id: string) => void) {
  Alert.alert('Supprimer ce produit ?', `« ${product.name} » sera supprimé de l'inventaire.`, [
    { text: 'Annuler', style: 'cancel' },
    // `destructive` : iOS affiche le bouton en rouge pour signaler une action irréversible.
    { text: 'Supprimer', style: 'destructive', onPress: () => onConfirm(product.id) },
  ]);
}
