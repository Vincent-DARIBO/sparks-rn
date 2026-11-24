import ProductEditLink from '@/features/products/components/ProductEditLink';
import useProductDetailRoute from '@/features/products/hooks/useProductDetailRoute';
import ProductDetailScreen from '@/features/products/screens/ProductDetailScreen';
import NotFoundScreen from '@/shared/components/NotFoundScreen';

/**
 * Route dynamique `/product/[id]` : les crochets du nom de dossier font de `id` un paramètre.
 * Lien profond : scanstock://product/1 (ou exp://<IP>:8081/--/product/1 dans Expo Go)
 * ouvre directement cette fiche.
 */
export default function ProductRoute() {
  const { id, product, isFavorite, toggleFavorite, adjustQuantity, goBack } = useProductDetailRoute();

  // Un lien profond peut contenir n'importe quel identifiant : on le prévoit.
  if (!product) {
    return <NotFoundScreen message={`Aucun produit avec l'identifiant « ${id} ».`} />;
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
