import { useContext } from 'react';

import { InventoryContext, type InventoryContextValue } from '../InventoryContext';

/** Lit l'inventaire partagé ; échoue clairement si le Provider est absent. */
export default function useInventoryContext(): InventoryContextValue {
  const value = useContext(InventoryContext);
  if (!value) {
    throw new Error('useInventoryContext doit être utilisé sous <InventoryProvider>.');
  }
  return value;
}
