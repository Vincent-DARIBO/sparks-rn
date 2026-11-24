import { useRouter } from 'expo-router';

import { showReadOnlyNotice } from '../utils/showReadOnlyNotice';

// Pas de catégorie par défaut : l'utilisateur DOIT en choisir une.
const NEW_PRODUCT_DEFAULTS = { name: '', brand: '', barcode: '', quantity: 0, minQuantity: 5 };

/** Logique de la modale `/product/new` : valeurs de départ, annuler, créer. */
export default function useNewProductRoute() {
  const router = useRouter();

  const cancel = () => router.back();

  // Lecture seule : la saisie est validée, mais la modale reste ouverte et rien n'est créé.
  return { defaultValues: NEW_PRODUCT_DEFAULTS, cancel, submit: showReadOnlyNotice };
}
