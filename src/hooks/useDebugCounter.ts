import { useState } from 'react';

/**
 * Compteur d'appuis qui sert de support à la démonstration du debugging :
 * le composant lit `pressCount` et branche `handlePress`, sans état local.
 */
export default function useDebugCounter() {
  // État local : nombre d'appuis sur le bouton.
  const [pressCount, setPressCount] = useState(0);

  function handlePress() {
    const next = pressCount + 1;

    // 1) Visible dans le terminal Expo ET dans l'onglet Console de DevTools.
    console.log(`[Scan'Stock] Appui n°${next}`);

    // 2) Décommentez la ligne suivante : quand DevTools est ouvert, l'app se met
    //    en pause ici. Inspectez `next` et `pressCount` dans l'onglet Sources.
    // debugger;

    // 3) Les warnings ont leur propre niveau dans la console (filtrables).
    if (next % 5 === 0) {
      console.warn(`Déjà ${next} appuis !`);
    }

    setPressCount(next);
  }

  return { pressCount, handlePress };
}
