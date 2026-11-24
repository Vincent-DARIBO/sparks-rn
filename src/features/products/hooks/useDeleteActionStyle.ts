import { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

export const ACTION_WIDTH = 96;

// `translation` est une valeur PARTAGÉE : Reanimated la met à jour sur le thread UI à chaque
// mouvement du doigt, sans re-rendu React. On l'interpole donc dans un `useAnimatedStyle`.
// Elle vaut 0 (carte fermée) et tend vers -ACTION_WIDTH (action entièrement révélée).
export default function useDeleteActionStyle(translation: SharedValue<number>) {
  // Au repos, l'action est masquée : sinon le rouge déborde aux coins arrondis de la carte.
  const containerStyle = useAnimatedStyle(() => ({ opacity: translation.value < 0 ? 1 : 0 }));

  // L'icône apparaît (opacité 0 → 1) et grossit (échelle 0,6 → 1) en suivant le doigt.
  // 'clamp' : au-delà de l'ouverture complète, les valeurs ne dépassent pas 1.
  const iconStyle = useAnimatedStyle(() => {
    const progress = interpolate(-translation.value, [0, ACTION_WIDTH], [0, 1], 'clamp');
    return { opacity: progress, transform: [{ scale: 0.6 + progress * 0.4 }] };
  });

  return { containerStyle, iconStyle };
}
