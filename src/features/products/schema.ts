import { z } from 'zod';

import { MAX_QUANTITY, type Category } from './types';

/**
 * Vérifie la clé de contrôle d'un code EAN-13 : le 13e chiffre complète la somme
 * des 12 premiers (pondérés alternativement par 1 et 3) au multiple de 10 supérieur.
 * Règle métier du ticket optionnel SCAN-B5, testée au Module 10.
 */
export function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  const digits = code.split('').map(Number);
  const sum = digits
    .slice(0, 12)
    .reduce((acc, digit, index) => acc + digit * (index % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10 === digits[12];
}

const CATEGORIES = ['boissons', 'epicerie', 'biscuits', 'petit-dejeuner'] as const;

/**
 * Schéma de validation du formulaire produit, commun à la création et à la modification.
 * Zod 4 : le message d'erreur se passe dans `{ error: '…' }`.
 */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Le nom doit contenir au moins 2 caractères.' })
    .max(60, { error: 'Le nom ne doit pas dépasser 60 caractères.' }),
  brand: z.string().trim().min(1, { error: 'La marque est obligatoire.' }),
  barcode: z
    .string()
    .trim()
    .regex(/^\d{13}$/, { error: 'Le code-barres doit contenir 13 chiffres.' })
    .refine(isValidEan13, { error: "Ce code-barres n'est pas un EAN-13 valide (clé de contrôle)." }),
  category: z.enum(CATEGORIES, { error: 'Choisissez une catégorie.' }),
  quantity: z
    .number()
    .int()
    .min(0, { error: 'La quantité ne peut pas être négative.' })
    .max(MAX_QUANTITY, { error: 'La quantité ne doit pas dépasser 9 999.' }),
  minQuantity: z.number().int().min(0).max(999, { error: 'Seuil trop élevé (999 maximum).' }),
});

// Une seule source de vérité : `z.infer` DÉDUIT le type TypeScript des valeurs du formulaire
// à partir du schéma. Ajouter un champ au schéma l'ajoute au type, sans rien écrire à la main.
export type ProductFormValues = z.infer<typeof productSchema>;

// Un produit renvoyé par le serveur = un produit de formulaire + l'identifiant généré par le serveur.
export const apiProductSchema = productSchema.extend({ id: z.string() });

// Validation de la liste complète : une réponse mal formée lève une erreur au lieu de polluer le cache.
export const apiProductListSchema = z.array(apiProductSchema);

// Garde-fou : si une catégorie est ajoutée au type Category sans l'être au schéma
// (ou l'inverse), TypeScript signale une erreur sur cette ligne.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const categoriesInSync: Same<ProductFormValues['category'], Category> = true;
void categoriesInSync;
