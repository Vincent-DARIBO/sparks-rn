import ProductEditLink from '@/features/products/components/ProductEditLink';
import useProductDetailRoute from '@/features/products/hooks/useProductDetailRoute';
import ProductDetailScreen from '@/features/products/screens/ProductDetailScreen';
import BackButton from '@/shared/components/BackButton';
import ErrorView from '@/shared/components/ErrorView';
import Header from '@/shared/components/Header';
import LoadingView from '@/shared/components/LoadingView';
import NotFoundScreen from '@/shared/components/NotFoundScreen';

/**
 * Route dynamique `/product/[id]` : les crochets du nom de dossier font de `id` un paramètre.
 * Lien profond : scanstock://product/1 (ou exp://<IP>:8081/--/product/1 dans Expo Go)
 * ouvre directement cette fiche.
 */
export default function ProductRoute() {
  const {
    id,
    product,
    isProductNotFound,
    errorMessage,
    refetchProduct,
    isRefetchingProduct,
    isFavorite,
    toggleFavorite,
    adjustQuantity,
    goBack,
  } = useProductDetailRoute();

  // Un lien profond peut contenir n'importe quel identifiant : l'API répond 404.
  if (isProductNotFound) {
    return <NotFoundScreen title="Produit introuvable" message={`Aucun produit avec l'identifiant « ${id} ».`} />;
  }
  // Des données déjà connues (cache) s'affichent, même si leur mise à jour a échoué.
  if (!product) {
    // L'en-tête et son bouton retour restent disponibles pendant le chargement et en cas d'erreur.
    const header = <Header title="Fiche produit" left={<BackButton onPress={goBack} />} />;
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

  return (
    <ProductDetailScreen
      product={product}
      isFavorite={isFavorite(product.id)}
      onToggleFavorite={toggleFavorite}
      onAdjustQuantity={adjustQuantity}
      onBack={goBack}
      headerRight={<ProductEditLink productId={product.id} />}
    />
  );
}
