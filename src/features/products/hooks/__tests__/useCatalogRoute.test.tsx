import { renderHook } from '@testing-library/react-native';

import { createTestQueryClient, createWrapper } from '@/test/queryClientWrapper';

import { ProductService } from '../../services/ProductService';
import useCatalogRoute from '../useCatalogRoute';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

/**
 * Régression de performances (SCAN-22) : les callbacks donnés aux cartes doivent garder la MÊME
 * référence d'un rendu à l'autre. Sinon `renderItem` change et FlashList re-rend toutes les cellules.
 */
describe('useCatalogRoute', () => {
  it('garde les mêmes callbacks entre deux rendus', async () => {
    jest.spyOn(ProductService, 'list').mockResolvedValue([]);
    const { result, rerender } = await renderHook(() => useCatalogRoute(), {
      wrapper: createWrapper(createTestQueryClient()),
    });
    const { openProduct, deleteProduct, adjustQuantity } = result.current;

    await rerender({});

    expect(result.current.openProduct).toBe(openProduct);
    expect(result.current.deleteProduct).toBe(deleteProduct);
    expect(result.current.adjustQuantity).toBe(adjustQuantity);
  });
});
