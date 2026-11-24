import type { ReactNode } from 'react';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ACTION_WIDTH } from '../hooks/useDeleteActionStyle';
import useSwipeableRow from '../hooks/useSwipeableRow';
import type { Product } from '../types';
import DeleteAction from './DeleteAction';

interface SwipeableRowProps {
  product: Product;
  onDelete: (id: string) => void;
  children: ReactNode;
}

// Module 9 : glisser vers la gauche pour révéler « Supprimer ».
// ReanimatedSwipeable suit le doigt sur le thread UI (aucun re-rendu React pendant le glissement).
export default function SwipeableRow(props: SwipeableRowProps) {
  const { product, onDelete, children } = props;
  const { swipeableRef, closeAndDelete } = useSwipeableRow(product, onDelete);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      // friction 2 : la carte suit le doigt à demi-vitesse, il faut donc environ deux fois plus de course du doigt pour atteindre le seuil.
      friction={2}
      // Seuil d'ouverture : relâcher avant la moitié de l'action referme la carte, au-delà elle reste ouverte.
      rightThreshold={ACTION_WIDTH / 2}
      // Pas de rebond au-delà de l'action : la carte s'arrête net quand elle est entièrement ouverte.
      overshootRight={false}
      // Le glissement ne démarre qu'après 10 pt de mouvement HORIZONTAL (réglage par défaut) :
      // un geste vertical reste à la liste, qui défile normalement.
      renderRightActions={(_progress, translation) => (
        <DeleteAction translation={translation} productName={product.name} onPress={closeAndDelete} />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}
