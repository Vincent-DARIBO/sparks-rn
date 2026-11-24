import type { BarcodeScanningResult } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

// La caméra lit environ 30 fois par seconde, et le téléphone reste souvent pointé sur le produit.
const SAME_BARCODE_DELAY_MS = 2500;

interface LastScan {
  barcode: string;
  scannedAt: number;
}

/** Logique de l'écran caméra : onglet affiché ou non, lampe, anti-doublon, zones sûres. */
export default function useBarcodeCamera(onBarcodeScanned: (barcode: string) => void) {
  // Les onglets restent MONTÉS quand on en change : sans précaution, la caméra continuerait
  // de filmer derrière le Catalogue (batterie, voyant allumé, vie privée).
  // `useIsFocused()` dit si l'écran est affiché ; il devient faux aussi quand une fiche
  // est empilée par-dessus les onglets.
  const isCameraActive = useIsFocused();
  const [isTorchOn, setIsTorchOn] = useState(false);
  // Une `ref` et non un état : le dernier code n'est jamais affiché. Le modifier ne doit donc
  // pas redessiner l'écran (30 fois par seconde !). Sa valeur survit pourtant aux rendus.
  const lastScanRef = useRef<LastScan | null>(null);
  // Encoche et Dynamic Island en haut ; en paysage, elles passent sur un côté.
  const insets = useSafeAreaInsets();

  const toggleTorch = () => setIsTorchOn((isOn) => !isOn);

  // Anti-doublon : un même code n'est pas relu avant 2,5 secondes.
  const handleCameraScan = ({ data }: BarcodeScanningResult) => {
    const now = Date.now();
    const lastScan = lastScanRef.current;
    const isRepeat = lastScan?.barcode === data && now - lastScan.scannedAt < SAME_BARCODE_DELAY_MS;
    if (isRepeat) return;
    lastScanRef.current = { barcode: data, scannedAt: now };
    onBarcodeScanned(data);
  };

  return {
    isCameraActive,
    isTorchOn,
    toggleTorch,
    handleCameraScan,
    topBarPadding: {
      paddingTop: insets.top + spacing.md,
      paddingLeft: insets.left + spacing.lg,
      paddingRight: insets.right + spacing.lg,
    },
    footerPadding: { paddingLeft: insets.left + spacing.lg, paddingRight: insets.right + spacing.lg },
  };
}
