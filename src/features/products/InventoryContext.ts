import { createContext } from 'react';

import type useInventoryState from './hooks/useInventoryState';

export type InventoryContextValue = ReturnType<typeof useInventoryState>;

// `null` par défaut : on détecte un oubli du Provider (voir useInventoryContext).
export const InventoryContext = createContext<InventoryContextValue | null>(null);
