import type { ReactNode } from 'react';

import { InventoryContext } from './InventoryContext';
import useInventoryState from './hooks/useInventoryState';

interface InventoryProviderProps {
  children: ReactNode;
}

/** Fournit l'inventaire partagé à toutes les routes (monté dans le layout racine). */
export default function InventoryProvider(props: InventoryProviderProps) {
  const { children } = props;
  const value = useInventoryState();

  return <InventoryContext value={value}>{children}</InventoryContext>;
}
