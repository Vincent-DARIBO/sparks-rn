import { render, screen, userEvent } from '@testing-library/react-native';
import { Profiler } from 'react';

import { useFavoritesStore } from '../../stores/favoritesStore';
import type { Product } from '../../types';
import ProductCard from '../ProductCard';

/**
 * Régression de performances (SCAN-22) : toucher l'étoile d'UN produit ne doit rendre que SA carte.
 * `Profiler` appelle `onRender` à chaque rendu de ce qu'il entoure : on compte les rendus par carte.
 */
const makeProduct = (id: string): Product => ({
  id,
  name: `Produit ${id}`,
  brand: 'Marque',
  barcode: '3017620422003',
  category: 'epicerie',
  quantity: 10,
  minQuantity: 5,
});

describe('ProductCard', () => {
  it("ne re-rend pas la carte d'un autre produit quand un favori change", async () => {
    useFavoritesStore.setState({ favoriteIds: [] });
    const renders = { '1': 0, '2': 0 };
    const onAdjustQuantity = jest.fn();
    const onPress = jest.fn();

    await render(
      <>
        {(['1', '2'] as const).map((id) => (
          <Profiler key={id} id={id} onRender={() => (renders[id] += 1)}>
            <ProductCard product={makeProduct(id)} onAdjustQuantity={onAdjustQuantity} onPress={onPress} />
          </Profiler>
        ))}
      </>,
    );
    const rendersBefore = { ...renders };

    // Les petites étoiles sont masquées au lecteur d'écran (SCAN-26) : on les atteint comme au doigt.
    const user = userEvent.setup();
    await user.press(screen.getAllByLabelText('Ajouter aux favoris', { includeHiddenElements: true })[0]);

    expect(renders['1']).toBe(rendersBefore['1'] + 1);
    expect(renders['2']).toBe(rendersBefore['2']);
  });
});
