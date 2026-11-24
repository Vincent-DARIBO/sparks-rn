import { useEffect, useState } from 'react';

/**
 * Renvoie `value` seulement quand elle n'a plus changé depuis `delay` ms.
 * Le champ de recherche reste réactif, mais on ne refiltre le catalogue
 * qu'après une courte pause de frappe, pas à chaque caractère.
 */
export default function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Nettoyage : si `value` change avant la fin du délai, on annule le minuteur.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
