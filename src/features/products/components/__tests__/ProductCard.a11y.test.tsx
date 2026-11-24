import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useFavoritesStore } from '../../stores/favoritesStore';
import type { Product } from '../../types';
import ProductCard from '../ProductCard';

/** SCAN-26 : on cherche la carte comme un lecteur d'écran l'annonce (rôle + nom accessible). */
const product: Product = {
  id: '2',
  name: 'Soda cola 33 cl',
  brand: 'Coca-Cola',
  barcode: '5449000000996',
  category: 'boissons',
  quantity: 6,
  minQuantity: 12,
};

const cardName = 'Soda cola 33 cl, Coca-Cola, Stock bas, 6 unités';

describe('ProductCard : accessibilité', () => {
  beforeEach(() => useFavoritesStore.setState({ favoriteIds: [] }));

  it('déclenche l’action « add » du lecteur d’écran', async () => {
    const onAdjustQuantity = jest.fn();
    await render(<ProductCard product={product} onAdjustQuantity={onAdjustQuantity} onPress={jest.fn()} />);

    await fireEvent(screen.getByRole('button', { name: cardName }), 'accessibilityAction', {
      nativeEvent: { actionName: 'add' },
    });

    expect(onAdjustQuantity).toHaveBeenCalledWith('2', 1);
  });

  it('propose « Supprimer » avec la même confirmation que le glissement', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const onDelete = jest.fn();
    await render(<ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={jest.fn()} onDelete={onDelete} />);

    await fireEvent(screen.getByRole('button', { name: cardName }), 'accessibilityAction', {
      nativeEvent: { actionName: 'delete' },
    });

    expect(alertSpy).toHaveBeenCalledWith('Supprimer ce produit ?', expect.any(String), expect.any(Array));
    expect(onDelete).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('masque les petits boutons et l’étoile au lecteur d’écran', async () => {
    await render(<ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={jest.fn()} />);

    for (const name of ['Ajouter une unité', 'Retirer une unité', 'Ajouter aux favoris']) {
      expect(screen.queryByRole('button', { name })).toBeNull();
      expect(screen.getByRole('button', { name, includeHiddenElements: true })).toBeTruthy();
    }
  });

  it('retire une unité avec l’action « remove »', async () => {
    const onAdjustQuantity = jest.fn();
    await render(<ProductCard product={product} onAdjustQuantity={onAdjustQuantity} onPress={jest.fn()} />);

    await fireEvent(screen.getByRole('button', { name: cardName }), 'accessibilityAction', {
      nativeEvent: { actionName: 'remove' },
    });

    expect(onAdjustQuantity).toHaveBeenCalledWith('2', -1);
  });

  it('bascule le favori avec l’action « favorite »', async () => {
    await render(<ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={jest.fn()} />);

    await fireEvent(screen.getByRole('button', { name: cardName }), 'accessibilityAction', {
      nativeEvent: { actionName: 'favorite' },
    });

    expect(useFavoritesStore.getState().favoriteIds).toContain('2');
  });

  it('ouvre la fiche avec l’action « activate » et avec l’appui du lecteur d’écran', async () => {
    const onPress = jest.fn();
    await render(<ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={onPress} />);
    const card = screen.getByRole('button', { name: cardName });

    await fireEvent(card, 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    await fireEvent(card, 'accessibilityTap');

    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onPress).toHaveBeenCalledWith('2');
  });

  it('ne propose « Supprimer » que si la carte est supprimable', async () => {
    const { rerender } = await render(
      <ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={jest.fn()} />,
    );
    const actionLabels = () =>
      screen.getByRole('button', { name: cardName }).props.accessibilityActions.map((action: { label?: string }) => action.label);

    expect(actionLabels()).not.toContain('Supprimer');

    await rerender(<ProductCard product={product} onAdjustQuantity={jest.fn()} onPress={jest.fn()} onDelete={jest.fn()} />);

    expect(actionLabels()).toContain('Supprimer');
  });
});
