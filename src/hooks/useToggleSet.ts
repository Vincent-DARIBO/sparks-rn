import { useCallback, useState } from 'react';

/**
 * Hook générique : un ensemble de valeurs que l'on peut activer / désactiver.
 *
 * `T` est un paramètre de type (générique) : le même hook fonctionne pour des
 * identifiants `string`, des `number`, etc., avec un typage exact à l'usage.
 */
export default function useToggleSet<T>(initial: T[] = []) {
  const [values, setValues] = useState<Set<T>>(() => new Set(initial));

  // useCallback : la fonction garde la même référence d'un rendu à l'autre.
  // Utile quand on la passe en prop à des composants mémoïsés.
  // (Avec React Compiler activé, cette mémoïsation devient automatique.)
  const toggle = useCallback((value: T) => {
    setValues((prev) => {
      // Immutabilité : on crée un NOUVEAU Set, on ne modifie jamais l'ancien,
      // sinon React ne détecte pas le changement.
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const has = useCallback((value: T) => values.has(value), [values]);

  return { values, toggle, has, count: values.size };
}
