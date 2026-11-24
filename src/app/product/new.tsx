import ProductForm from '@/features/products/components/ProductForm';
import useNewProductRoute from '@/features/products/hooks/useNewProductRoute';

/**
 * Route `/product/new`, présentée en MODALE (option du layout racine).
 * Pas de conflit avec `/product/[id]` : Expo Router essaie une route statique (`new`)
 * avant une route dynamique (`[id]`).
 */
export default function NewProductRoute() {
  const { defaultValues, cancel, submit } = useNewProductRoute();

  return <ProductForm title="Nouveau produit" defaultValues={defaultValues} onSubmit={submit} onCancel={cancel} />;
}
