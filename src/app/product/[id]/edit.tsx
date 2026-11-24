import ProductForm from '@/features/products/components/ProductForm';
import useProductEditRoute from '@/features/products/hooks/useProductEditRoute';
import NotFoundScreen from '@/shared/components/NotFoundScreen';

/**
 * Route `/product/[id]/edit`, présentée en MODALE (option du layout racine).
 * La route reste mince : la logique est dans le hook, l'interface dans le formulaire.
 * Le bouton retour matériel d'Android ferme la modale, sans rien enregistrer.
 */
export default function EditProductRoute() {
  const { id, defaultValues, cancel, save } = useProductEditRoute();

  if (!defaultValues) {
    return <NotFoundScreen message={`Aucun produit avec l'identifiant « ${id} ».`} />;
  }

  return <ProductForm title="Modifier le produit" defaultValues={defaultValues} onSubmit={save} onCancel={cancel} />;
}
