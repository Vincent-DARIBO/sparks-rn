import useProductEditRoute from '@/features/products/hooks/useProductEditRoute';
import EditProductScreen from '@/features/products/screens/EditProductScreen';
import NotFoundScreen from '@/shared/components/NotFoundScreen';

/**
 * Route `/product/[id]/edit`, présentée en MODALE (option du layout racine).
 * La route reste mince : la logique est dans le hook, l'interface dans l'écran.
 * Le bouton retour matériel d'Android ferme la modale, sans rien enregistrer.
 */
export default function EditProductRoute() {
  const { id, defaultValues, cancel, save } = useProductEditRoute();

  if (!defaultValues) {
    return <NotFoundScreen message={`Aucun produit avec l'identifiant « ${id} ».`} />;
  }

  return <EditProductScreen defaultValues={defaultValues} onSave={save} onCancel={cancel} />;
}
