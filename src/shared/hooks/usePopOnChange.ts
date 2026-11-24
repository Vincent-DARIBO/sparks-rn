import { useLayoutEffect, useRef } from 'react';
import { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

/**
 * « Pulsation » quand une valeur change (ex. la quantité en stock).
 *
 * - THREAD UI contre THREAD JS : le JavaScript de React tourne sur le thread JS. Si on animait
 *   avec un état React, chaque image demanderait un nouveau rendu : saccades dès que le thread JS
 *   est occupé. Ici, l'animation tourne entièrement sur le thread UI (celui qui dessine l'écran).
 * - `useSharedValue` : une VALEUR PARTAGÉE, lisible et modifiable depuis les deux threads,
 *   SANS provoquer de rendu React. On lui affecte une animation, le thread UI la joue seul.
 * - `withSequence` enchaîne deux animations : grossir vite (`withTiming`), puis revenir à 1
 *   avec un effet de ressort (`withSpring`).
 * - `useAnimatedStyle` : le style est recalculé sur le thread UI à chaque image.
 *
 * CHANGEMENT DE QUANTITÉ ou RECYCLAGE DE CELLULE ? Dans une FlashList, une cellule qui sort de
 * l'écran est réutilisée pour un AUTRE produit : sa quantité « change » aussi, sans que le stock
 * ait bougé. On mémorise donc la valeur ET l'identité (l'id du produit) du rendu précédent :
 * on n'anime que si l'identité est restée la même. Au montage, au recyclage ou pour une valeur
 * identique (le serveur confirme la valeur optimiste déjà affichée), pas d'animation.
 * `identity` est facultative : SANS elle, le hook ne peut pas reconnaître un recyclage et pulse
 * aussi quand une cellule de liste change de produit. Dans une liste, il faut donc la fournir.
 *
 * « RÉDUIRE LES ANIMATIONS » : rien à coder. Reanimated lit ce réglage du téléphone au démarrage
 * de l'application et, par défaut (`ReduceMotion.System`), `withTiming` et `withSpring` sautent
 * directement à leur valeur finale. La séquence se termine donc immédiatement à l'échelle 1.
 */
export default function usePopOnChange(value: unknown, identity?: string, scaleTo = 1.15) {
  const scale = useSharedValue(1);
  const previous = useRef({ value, identity });

  // useLayoutEffect plutôt que useEffect : il s'exécute AVANT que l'écran soit dessiné. La remise
  // à 1 d'une cellule recyclée est donc appliquée avant la première image du nouveau produit.
  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = { value, identity };
    if (before.identity !== identity) {
      // Cellule recyclée : affecter une valeur simple arrête une pulsation encore en cours,
      // qui serait sinon visible sur le nouveau produit.
      scale.value = 1;
      return;
    }
    if (Object.is(before.value, value)) return;
    // Appuis rapides : chaque nouvelle séquence remplace la précédente en partant de l'échelle
    // actuelle, et la dernière étape ramène toujours à 1. Rien ne s'empile.
    // withTiming : grossir en 90 ms. withSpring, réglé par durée plutôt que par masse/raideur :
    // `duration` = durée perçue du retour (le ressort dure en réalité 1,5 fois plus, ~375 ms) ;
    // `dampingRatio` = amortissement : 1 = aucun rebond, < 1 = rebond ; 0.7 = un seul petit rebond.
    scale.value = withSequence(
      withTiming(scaleTo, { duration: 90 }),
      withSpring(1, { duration: 250, dampingRatio: 0.7 }),
    );
  }, [value, identity, scale, scaleTo]);

  // Une échelle (transformation) ne change pas la taille dans la mise en page : rien ne bouge autour.
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}
