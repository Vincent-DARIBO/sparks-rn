import ScannedProductCard from '@/features/products/components/ScannedProductCard';
import useScanResult from '@/features/products/hooks/useScanResult';
import ScannerScreen from '@/features/scanner/screens/ScannerScreen';

/**
 * Route `/scanner` (onglet Scanner).
 *
 * Deux fonctionnalités se rencontrent ici, et seulement ici : `scanner` lit des codes-barres
 * sans rien savoir des produits, `products` sait quoi faire d'un code lu.
 * Une fonctionnalité n'importe jamais une autre ; la route, elle, a le droit de les assembler.
 */
export default function ScannerRoute() {
  const { scannedBarcode, scannedProduct, handleBarcodeScanned, openProduct, createProduct } = useScanResult();

  // Trois cas : rien lu encore, produit connu, code inconnu.
  let resultCard = null;
  if (scannedProduct) {
    resultCard = (
      <ScannedProductCard kind="known" product={scannedProduct} onOpen={() => openProduct(scannedProduct.id)} />
    );
  } else if (scannedBarcode) {
    resultCard = (
      <ScannedProductCard kind="unknown" barcode={scannedBarcode} onCreate={() => createProduct(scannedBarcode)} />
    );
  }

  return <ScannerScreen onBarcodeScanned={handleBarcodeScanned} resultCard={resultCard} />;
}
