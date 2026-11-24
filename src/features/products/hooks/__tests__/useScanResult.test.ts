import { renderHook } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import type { Product } from '../../types';
import useScanResult from '../useScanResult';

const mockProducts: Product[] = [
  {
    id: '2',
    name: 'Soda cola 33 cl',
    brand: 'Coca-Cola',
    barcode: '5449000000996',
    category: 'boissons',
    quantity: 6,
    minQuantity: 12,
  },
];

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../useProducts', () => ({ __esModule: true, default: () => ({ products: mockProducts }) }));
jest.mock('@/shared/services/HapticsService', () => ({ HapticsService: { notify: jest.fn() } }));

/** SCAN-26 : le résultat du scan est annoncé, car la carte apparaît sans que le focus y aille. */
describe('useScanResult : annonce du scan', () => {
  afterEach(() => jest.clearAllMocks());

  it('annonce le nom, l’état du stock et la quantité d’un produit connu', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    const { result } = await renderHook(() => useScanResult());

    result.current.handleBarcodeScanned('5449000000996');

    expect(announce).toHaveBeenCalledWith('Soda cola 33 cl, Stock bas, 6 unités');
  });

  it('annonce un code inconnu en l’épelant', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    const { result } = await renderHook(() => useScanResult());

    result.current.handleBarcodeScanned('123');

    expect(announce).toHaveBeenCalledWith('Code 1 2 3 inconnu. Vous pouvez créer ce produit.');
  });
});
