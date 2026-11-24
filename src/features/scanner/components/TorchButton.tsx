import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

// Surimpression de la caméra : icône blanche sur un rond sombre translucide, lisible sur n'importe quelle image filmée.
const CAMERA_OVERLAY_ICON = '#FFFFFF';
const CAMERA_OVERLAY_BUTTON = 'rgba(14,16,20,0.7)';

interface TorchButtonProps {
  isTorchOn: boolean;
  onPress: () => void;
}

/**
 * Bouton rond de la lampe. Rôle « interrupteur » : le lecteur d'écran annonce
 * « Lampe, interrupteur, activé » ou « désactivé ».
 */
export default function TorchButton(props: TorchButtonProps) {
  const { isTorchOn, onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityLabel="Lampe"
      accessibilityState={{ checked: isTorchOn }}
      style={styles.button}
    >
      <Ionicons name={isTorchOn ? 'flash' : 'flash-outline'} size={22} color={CAMERA_OVERLAY_ICON} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CAMERA_OVERLAY_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
