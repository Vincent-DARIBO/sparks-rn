import { CameraView, type BarcodeType } from 'expo-camera';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import useBarcodeCamera from '../hooks/useBarcodeCamera';
import TorchButton from './TorchButton';
import ViewFinder from './ViewFinder';

// Codes-barres des produits de grande consommation. Limiter les formats accélère la détection.
const BARCODE_TYPES: BarcodeType[] = ['ean13', 'ean8', 'upc_a', 'upc_e'];

// Surimpression de la caméra : texte blanc sur l'image filmée, dans les deux thèmes.
const CAMERA_OVERLAY_TEXT = '#FFFFFF';

interface BarcodeCameraProps {
  // Appelé une fois par code lu : les lectures répétées du même code sont ignorées.
  onBarcodeScanned: (barcode: string) => void;
  // Contenu affiché en bas, par-dessus la caméra (carte du produit lu).
  footer?: ReactNode;
}

/** Caméra arrière plein écran, barre du haut (titre, lampe), cadre de visée. Sombre dans les deux thèmes. */
export default function BarcodeCamera(props: BarcodeCameraProps) {
  const { onBarcodeScanned, footer } = props;
  const { styles } = useThemedStyles(createStyles);
  const { isCameraActive, isTorchOn, toggleTorch, handleCameraScan, topBarPadding, footerPadding } =
    useBarcodeCamera(onBarcodeScanned);

  return (
    <View style={styles.screen}>
      {/* Onglet caché : la caméra est démontée, donc libérée (et le voyant s'éteint). */}
      {isCameraActive ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={isTorchOn}
          barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
          onBarcodeScanned={handleCameraScan}
        />
      ) : null}

      <View style={[styles.topBar, topBarPadding]}>
        <Text style={styles.title} accessibilityRole="header">
          Scanner
        </Text>
        <TorchButton isTorchOn={isTorchOn} onPress={toggleTorch} />
      </View>

      <ViewFinder />

      {footer ? <View style={[styles.footer, footerPadding]}>{footer}</View> : null}
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    // `header` : la couleur sombre de l'en-tête, la même dans l'écran d'attente.
    screen: { flex: 1, backgroundColor: colors.header },
    topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    title: { ...typography.title, flex: 1, color: CAMERA_OVERLAY_TEXT },
    footer: { paddingBottom: spacing.lg },
  });
