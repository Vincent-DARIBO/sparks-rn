import { act, renderHook } from '@testing-library/react-native';
import { AccessibilityInfo, type AccessibilityActionEvent } from 'react-native';

import type { Product } from '../../types';
import useProductQuantity from '../useProductQuantity';

/** SCAN-26 : la quantité de la fiche est un élément « réglable » pour VoiceOver et TalkBack. */
const product: Product = {
  id: '1',
  name: 'Pâte à tartiner 400 g',
  brand: 'Nutella',
  barcode: '3017620422003',
  category: 'petit-dejeuner',
  quantity: 24,
  minQuantity: 10,
};

const action = (actionName: string) => ({ nativeEvent: { actionName } }) as AccessibilityActionEvent;

describe('useProductQuantity : accessibilité', () => {
  afterEach(() => jest.clearAllMocks());

  it('décrit la quantité par « N unités »', async () => {
    const { result } = await renderHook(() => useProductQuantity(product, jest.fn()));

    expect(result.current.quantityAccessibilityValue.text).toBe('24 unités');
  });

  it('« increment » ajoute une unité et annonce la nouvelle valeur', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    const onAdjustQuantity = jest.fn();
    const { result } = await renderHook(() => useProductQuantity(product, onAdjustQuantity));

    await act(async () => result.current.handleQuantityAccessibilityAction(action('increment')));

    expect(onAdjustQuantity).toHaveBeenCalledWith('1', 1);
    expect(announce).toHaveBeenCalledWith('25 unités');
  });

  it('« decrement » retire une unité et annonce la nouvelle valeur', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    const onAdjustQuantity = jest.fn();
    const { result } = await renderHook(() => useProductQuantity(product, onAdjustQuantity));

    await act(async () => result.current.handleQuantityAccessibilityAction(action('decrement')));

    expect(onAdjustQuantity).toHaveBeenCalledWith('1', -1);
    expect(announce).toHaveBeenCalledWith('23 unités');
  });

  it('n’annonce rien quand la quantité est déjà à 0', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    const onAdjustQuantity = jest.fn();
    const { result } = await renderHook(() => useProductQuantity({ ...product, quantity: 0 }, onAdjustQuantity));

    await act(async () => result.current.handleQuantityAccessibilityAction(action('decrement')));

    expect(onAdjustQuantity).not.toHaveBeenCalled();
    expect(announce).not.toHaveBeenCalled();
  });
});
