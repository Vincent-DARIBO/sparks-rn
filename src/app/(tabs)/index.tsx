import useCatalogRoute from '@/features/products/hooks/useCatalogRoute';
import CatalogScreen from '@/features/products/screens/CatalogScreen';
import ErrorView from '@/shared/components/ErrorView';
import Header from '@/shared/components/Header';
import LoadingView from '@/shared/components/LoadingView';

/**
 * Route `/` (onglet Catalogue).
 *
 * Les fichiers de `src/app` restent minces : ils relient la navigation et
 * les données aux écrans de `src/features`, qui ne savent rien du routeur.
 * Module 7 : la route gère les trois états d'une requête (chargement, erreur, données) ;
 * l'écran, lui, ne reçoit que des produits et, au besoin, un bandeau d'erreur.
 *
 * La fiche produit est une route de la pile, empilée PAR-DESSUS les onglets : le catalogue
 * reste monté dessous, la recherche et le filtre sont retrouvés au retour.
 */
export default function CatalogRoute() {
  const {
    products,
    isLoadingProducts,
    errorMessage,
    refetchProducts,
    isRefetchingProducts,
    isFavorite,
    toggleFavorite,
    favoritesCount,
    isLargeDataset,
    setIsLargeDataset,
    adjustQuantity,
    openProduct,
    addProduct,
  } = useCatalogRoute();

  const retry = () => void refetchProducts();

  // Pas encore de données (premier chargement) : écran de chargement, ou d'erreur s'il a échoué.
  if (isLoadingProducts || !products) {
    const header = <Header title="Scan'Stock" />;
    return errorMessage ? (
      <ErrorView header={header} message={errorMessage} onRetry={retry} isRetrying={isRefetchingProducts} />
    ) : (
      <LoadingView header={header} />
    );
  }

  return (
    <CatalogScreen
      products={products}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      favoritesCount={favoritesCount}
      onAdjustQuantity={adjustQuantity}
      onOpenProduct={openProduct}
      isLargeDataset={isLargeDataset}
      onToggleLargeDataset={setIsLargeDataset}
      onAddProduct={addProduct}
      refreshing={isRefetchingProducts}
      onRefresh={retry}
      // Données déjà affichées : une actualisation en échec n'efface ni la liste, ni la recherche,
      // ni le filtre. L'erreur s'affiche en bandeau au-dessus.
      errorBanner={
        errorMessage ? (
          <ErrorView compact message={errorMessage} onRetry={retry} isRetrying={isRefetchingProducts} />
        ) : null
      }
    />
  );
}
