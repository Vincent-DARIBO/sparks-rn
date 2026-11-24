import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import BarcodeCamera from '../components/BarcodeCamera';
import CameraPermissionPrompt from '../components/CameraPermissionPrompt';
import useCameraPermission from '../hooks/useCameraPermission';

interface ScannerScreenProps {
  onBarcodeScanned: (barcode: string) => void;
  // Carte du dernier code lu, fournie par la route : le scanner ne connaît pas les produits.
  resultCard?: ReactNode;
}

/** Onglet Scanner : trois états d'autorisation, trois affichages. */
export default function ScannerScreen(props: ScannerScreenProps) {
  const { onBarcodeScanned, resultCard } = props;
  const { styles } = useThemedStyles(createStyles);
  const { isPermissionKnown, isPermissionGranted, canAskAgain, askOrOpenSettings } = useCameraPermission();

  // 1) Réponse du système pas encore arrivée (quelques millisecondes) : un fond uni, le temps de la lecture.
  if (!isPermissionKnown) return <View style={styles.waiting} />;

  // 2) Pas d'autorisation : on explique, et on propose d'autoriser ou d'ouvrir les réglages.
  if (!isPermissionGranted) {
    return <CameraPermissionPrompt canAskAgain={canAskAgain} onPress={askOrOpenSettings} />;
  }

  // 3) Autorisation accordée.
  return <BarcodeCamera onBarcodeScanned={onBarcodeScanned} footer={resultCard} />;
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    // Même couleur que le fond de la caméra et que l'en-tête de l'écran d'explication.
    waiting: { flex: 1, backgroundColor: colors.header },
  });
