import type { TFunction } from 'i18next';
import { Alert } from 'react-native';

import type { Product } from '../types';

// Toute action destructrice se confirme : on ne supprime pas sur un simple geste.
// `t` vient du hook appelant : cette fonction n'est pas un composant, elle ne peut pas appeler `useTranslation`.
export function confirmDeleteProduct(product: Product, onConfirm: (id: string) => void, t: TFunction) {
  Alert.alert(t('catalog.deleteTitle'), t('catalog.deleteMessage', { name: product.name }), [
    { text: t('common.cancel'), style: 'cancel' },
    // `destructive` : iOS affiche le bouton en rouge pour signaler une action irréversible.
    { text: t('common.delete'), style: 'destructive', onPress: () => onConfirm(product.id) },
  ]);
}
