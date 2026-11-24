import { getStockStatus } from '../stock';

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
