import type { Product } from '../../types';
import { formatUnits, getProductAccessibilityLabel } from '../productAccessibility';

const soda: Product = {
  id: '2',
  name: 'Soda cola 33 cl',
  brand: 'Coca-Cola',
  barcode: '5449000000996',
  category: 'boissons',
  quantity: 6,
  minQuantity: 12,
};

describe('getProductAccessibilityLabel', () => {
  it('dit nom, marque, état du stock et quantité en une phrase', () => {
    expect(getProductAccessibilityLabel(soda, false)).toBe('Soda cola 33 cl, Coca-Cola, Stock bas, 6 unités');
  });

  it('met « unité » au singulier pour une seule unité', () => {
    expect(getProductAccessibilityLabel({ ...soda, quantity: 1 }, false)).toBe(
      'Soda cola 33 cl, Coca-Cola, Stock bas, 1 unité',
    );
  });

  it('ajoute « favori » quand le produit est en favori', () => {
    expect(getProductAccessibilityLabel(soda, true)).toBe('Soda cola 33 cl, Coca-Cola, Stock bas, 6 unités, favori');
  });

  it('annonce la rupture', () => {
    expect(getProductAccessibilityLabel({ ...soda, quantity: 0 }, false)).toBe(
      'Soda cola 33 cl, Coca-Cola, Rupture, 0 unité',
    );
  });
});

describe('formatUnits', () => {
  it('accorde « unité(s) »', () => {
    expect(formatUnits(25)).toBe('25 unités');
    expect(formatUnits(1)).toBe('1 unité');
  });
});
