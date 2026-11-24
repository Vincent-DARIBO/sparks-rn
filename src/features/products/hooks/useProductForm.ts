import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type DefaultValues } from 'react-hook-form';

import { productSchema, type ProductFormValues } from '../schema';

interface UseProductFormParams {
  /**
   * Valeurs de départ. `DefaultValues` rend chaque champ facultatif :
   * la création s'ouvre sans catégorie, la modification s'ouvre préremplie.
   */
  defaultValues: DefaultValues<ProductFormValues>;
  /** Appelé seulement si TOUTES les règles du schéma sont respectées. */
  onSubmit: (values: ProductFormValues) => void;
}

/**
 * État du formulaire produit.
 * React Hook Form garde la valeur de chaque champ sans redessiner tout l'écran à chaque frappe.
 * `useForm` vit ici, jamais dans un composant : le composant ne fait que du JSX.
 */
export default function useProductForm(params: UseProductFormParams) {
  const { defaultValues, onSubmit } = params;
  const { control, handleSubmit } = useForm<ProductFormValues>({
    // Le résolveur branche le schéma Zod sur React Hook Form : à chaque validation,
    // RHF confie les valeurs à Zod et récupère ses messages d'erreur, champ par champ.
    resolver: zodResolver(productSchema),
    defaultValues,
    // Le mode de validation décide QUAND une erreur apparaît. « onTouched » : un champ est
    // validé quand on le quitte, puis à chaque frappe une fois en erreur. L'utilisateur
    // n'est pas grondé pendant sa première saisie, et l'erreur disparaît dès qu'il corrige.
    mode: 'onTouched',
    // À l'enregistrement d'un formulaire invalide, RHF place le curseur dans le premier
    // champ en erreur (option activée par défaut, écrite ici pour la rendre visible).
    // Il utilise la `ref` transmise à chaque FormField : un champ sans ref (catégorie) est sauté.
    shouldFocusError: true,
  });

  // Erreur TypeScript attendue n° 2 (la n° 1, sur `ref`, est expliquée dans FormField) :
  // `onPress={handleSubmit(onSubmit)}` est refusé à cause du PARAMÈTRE de la fonction.
  // `handleSubmit(onSubmit)` attend un événement WEB (BaseSyntheticEvent), alors que `onPress`
  // lui passerait un événement d'appui NATIF (GestureResponderEvent) : types incompatibles.
  // Solution : une fonction sans paramètre qui appelle `handleSubmit(onSubmit)()` sans argument.
  // `void` dit seulement qu'on ignore volontairement la Promise renvoyée par handleSubmit.
  // handleSubmit valide d'abord tout le formulaire : `onSubmit` n'est appelé que s'il est valide.
  const submit = () => void handleSubmit(onSubmit)();

  return { control, submit };
}
