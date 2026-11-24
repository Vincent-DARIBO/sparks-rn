import { useLocalSearchParams, useRouter } from 'expo-router';

import type { ProductFormValues } from '../schema';
import type { Product } from '../types';
import { sanitizeBarcode } from '../utils/sanitizeBarcode';
import useCreateProduct from './useCreateProduct';

// Pas de catégorie par défaut : l'utilisateur DOIT en choisir une.
const NEW_PRODUCT_DEFAULTS = { name: '', brand: '', barcode: '', quantity: 0, minQuantity: 5 };

/**
 * Logique de la modale `/product/new` : valeurs de départ, annuler, créer.
 * Module 8 : `/product/new?barcode=3017620422003` (depuis le scanner) préremplit le code-barres.
 * Une URL peut être tapée ou modifiée à la main : le paramètre est nettoyé comme une saisie
 * au clavier (chiffres seulement, 13 au plus), puis le schéma le vérifie à l'enregistrement.
 */
export default function useNewProductRoute() {
  const router = useRouter();
  // `?barcode=a&barcode=b` donne un TABLEAU : on garde la première valeur.
  const { barcode } = useLocalSearchParams<{ barcode?: string | string[] }>();
  const barcodeParam = Array.isArray(barcode) ? barcode[0] : barcode;
  const { createProduct } = useCreateProduct();

  const cancel = () => router.back();

  const submit = async (values: ProductFormValues) => {
    let created: Product;
    try {
      // On ATTEND la réponse du serveur : il renvoie le produit créé, avec l'identifiant qu'il lui a attribué.
      created = await createProduct(values);
    } catch {
      // Échec déjà signalé par l'alerte globale : la modale reste ouverte, avec la saisie.
      return;
    }
    // Navigation HORS du try : une erreur de navigation ne doit pas être prise pour un échec d'enregistrement.
    // `replace` : la fiche remplace la modale, le retour ramène au catalogue (et non au formulaire).
    router.replace({ pathname: '/product/[id]', params: { id: created.id } });
  };

  return { defaultValues: { ...NEW_PRODUCT_DEFAULTS, barcode: sanitizeBarcode(barcodeParam ?? '') }, cancel, submit };
}
