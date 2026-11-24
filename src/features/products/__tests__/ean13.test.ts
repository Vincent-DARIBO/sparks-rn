import { isValidEan13 } from '../schema';

describe('isValidEan13', () => {
  it('accepte un code dont la clé de contrôle est juste', () => {
    expect(isValidEan13('3017620422003')).toBe(true);
  });

  it('refuse une clé de contrôle fausse', () => {
    expect(isValidEan13('3017620422004')).toBe(false);
  });

  it('refuse ce qui ne fait pas 13 chiffres', () => {
    expect(isValidEan13('301762042200')).toBe(false);
    expect(isValidEan13('30176204220a3')).toBe(false);
  });
});
