import { useForm } from 'react-hook-form';

import type { ProductFormValues } from '../types';

interface UseProductFormParams {
  /** Valeurs de départ : le formulaire s'ouvre prérempli. */
  defaultValues: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
}

/**
 * État du formulaire produit.
 * React Hook Form garde la valeur de chaque champ sans redessiner tout l'écran à chaque frappe.
 * `useForm` vit ici, jamais dans un composant : le composant ne fait que du JSX.
 */
export default function useProductForm(params: UseProductFormParams) {
  const { defaultValues, onSubmit } = params;
  const { control, handleSubmit } = useForm<ProductFormValues>({ defaultValues });

  // Erreur TypeScript attendue n° 2 (la n° 1, sur `ref`, est expliquée dans FormField) :
  // `onPress={handleSubmit(onSubmit)}` est refusé à cause du PARAMÈTRE de la fonction.
  // `handleSubmit(onSubmit)` attend un événement WEB (BaseSyntheticEvent), alors que `onPress`
  // lui passerait un événement d'appui NATIF (GestureResponderEvent) : types incompatibles.
  // Solution : une fonction sans paramètre qui appelle `handleSubmit(onSubmit)()` sans argument.
  // `void` dit seulement qu'on ignore volontairement la Promise renvoyée par handleSubmit.
  const submit = () => void handleSubmit(onSubmit)();

  return { control, submit };
}
