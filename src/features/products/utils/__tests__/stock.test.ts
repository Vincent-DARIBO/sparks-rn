import { getStockStatus, getStockText } from '../stock';

/** Fonction pure : mêmes entrées, même sortie. Aucun rendu, aucune doublure. */
describe('getStockStatus', () => {
  it('signale une rupture quand la quantité est nulle', () => {
    expect(getStockStatus(0, 5)).toBe('out');
  });

  it('signale un stock bas quand la quantité atteint le seuil', () => {
    expect(getStockStatus(5, 5)).toBe('low');
    expect(getStockStatus(1, 5)).toBe('low');
  });

  it('considère le stock suffisant au-dessus du seuil', () => {
    expect(getStockStatus(6, 5)).toBe('ok');
  });
});

describe('getStockText', () => {
  it('assemble le libellé du statut et la quantité', () => {
    expect(getStockText('ok', 25)).toBe('En stock · 25');
    expect(getStockText('low', 3)).toBe('Stock bas · 3');
    expect(getStockText('out', 0)).toBe('Rupture · 0');
  });
});
