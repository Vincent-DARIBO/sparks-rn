import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { HapticsService, type HapticFeedback } from '@/shared/services/HapticsService';
import { useSettingsStore } from '@/shared/stores/settingsStore';

import { formatUnits } from '../utils/productAccessibility';
import { getStockStatus, stockStatusLabels } from '../utils/stock';
import useProducts from './useProducts';

/**
 * Ce qui se passe quand un code-barres vient d'être lu : recherche du produit, vibration,
 * ouverture de la fiche. Indépendant de la caméra : `handleBarcodeScanned` reçoit un simple texte.
 */
export default function useScanResult() {
  const router = useRouter();
  // Les produits sont DÉJÀ dans le cache de TanStack Query (chargés par le Catalogue) :
  // on cherche le code-barres dans ce tableau, sans aucune requête au serveur par scan.
  const { products } = useProducts();
  const vibrateOnScan = useSettingsStore((state) => state.vibrateOnScan);
  const openAfterScan = useSettingsStore((state) => state.openAfterScan);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  const findProduct = (barcode: string) => products?.find((product) => product.barcode === barcode);

  // On garde le CODE, pas le produit : le produit est relu dans le cache à chaque rendu,
  // la carte affiche donc toujours le stock à jour.
  const scannedProduct = scannedBarcode ? findProduct(scannedBarcode) : undefined;

  const vibrate = async (feedback: HapticFeedback) => {
    try {
      await HapticsService.notify(feedback);
    } catch {
      // Une vibration manquée ne doit pas empêcher le scan : on l'ignore.
    }
  };

  const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });

  const createProduct = (barcode: string) => router.push({ pathname: '/product/new', params: { barcode } });

  const handleBarcodeScanned = (barcode: string) => {
    const product = findProduct(barcode);
    if (vibrateOnScan) void vibrate(product ? 'success' : 'warning');
    // Le lecteur d'écran annonce le résultat : la carte apparaît sans que le focus y soit déplacé.
    AccessibilityInfo.announceForAccessibility(
      product
        ? `${product.name}, ${stockStatusLabels[getStockStatus(product.quantity, product.minQuantity)]}, ${formatUnits(product.quantity)}`
        : `Code ${barcode.split('').join(' ')} inconnu. Vous pouvez créer ce produit.`,
    );
    setScannedBarcode(barcode);
    if (product && openAfterScan) openProduct(product.id);
  };

  return { scannedBarcode, scannedProduct, handleBarcodeScanned, openProduct, createProduct };
}
