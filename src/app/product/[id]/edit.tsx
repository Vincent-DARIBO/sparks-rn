import { useTranslation } from 'react-i18next';

import ProductForm from '@/features/products/components/ProductForm';
import ProductFormHeader from '@/features/products/components/ProductFormHeader';
import useProductEditRoute from '@/features/products/hooks/useProductEditRoute';
import ErrorView from '@/shared/components/ErrorView';
import LoadingView from '@/shared/components/LoadingView';
import NotFoundScreen from '@/shared/components/NotFoundScreen';

/**
 * Route `/product/[id]/edit`, présentée en MODALE (option du layout racine).
 * La route reste mince : la logique est dans le hook, l'interface dans le formulaire.
 * Le bouton retour matériel d'Android ferme la modale, sans rien enregistrer.
 */
export default function EditProductRoute() {
  const { t } = useTranslation();
  const { id, defaultValues, isProductNotFound, errorMessage, refetchProduct, isRefetchingProduct, cancel, save } =
    useProductEditRoute();

  if (isProductNotFound) {
    return <NotFoundScreen title={t('product.notFoundTitle')} message={t('product.notFound', { id })} />;
  }
  if (!defaultValues) {
    // Pendant le chargement ou en cas d'erreur, « Annuler » reste disponible pour fermer la modale.
    const header = <ProductFormHeader title="Modifier le produit" onCancel={cancel} />;
    return errorMessage ? (
      <ErrorView
        header={header}
        message={errorMessage}
        onRetry={() => void refetchProduct()}
        isRetrying={isRefetchingProduct}
      />
    ) : (
      <LoadingView header={header} />
    );
  }

  return <ProductForm title="Modifier le produit" defaultValues={defaultValues} onSubmit={save} onCancel={cancel} />;
}
