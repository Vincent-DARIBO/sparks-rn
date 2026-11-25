import type { Locale } from 'expo-localization';
import { createInstance } from 'i18next';

import { formatDateTime, formatNumber } from '../format';
import i18n, { getDeviceLanguage, i18nOptions, resolveLanguage } from '../index';
import { en } from '../locales/en';
import { fr } from '../locales/fr';

/** Liste les chemins de toutes les phrases d'un fichier de traduction : « stock.out », « catalog.title »… */
function keysOf(translations: object, prefix = ''): string[] {
  return Object.entries(translations).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

const locale = (languageCode: string | null) => ({ languageCode }) as Locale;

describe('traductions', () => {
  afterEach(() => i18n.changeLanguage('fr'));

  it("l'anglais a exactement les mêmes clés que le français", () => {
    expect(keysOf(en).sort()).toEqual(keysOf(fr).sort());
  });

  it('applique les règles de pluriel du français', async () => {
    await i18n.changeLanguage('fr');

    expect(i18n.t('stock.units', { count: 0 })).toBe('0 unité');
    expect(i18n.t('stock.units', { count: 1 })).toBe('1 unité');
    expect(i18n.t('stock.units', { count: 2 })).toBe('2 unités');
    expect(i18n.t('catalog.favorites', { count: 0 })).toBe('0 produit en favori');
    expect(i18n.t('catalog.favorites', { count: 2 })).toBe('2 produits en favori');
  });

  it('applique les règles de pluriel de l’anglais', async () => {
    await i18n.changeLanguage('en');

    expect(i18n.t('stock.units', { count: 0 })).toBe('0 units');
    expect(i18n.t('stock.units', { count: 1 })).toBe('1 unit');
    expect(i18n.t('stock.units', { count: 2 })).toBe('2 units');
    expect(i18n.t('catalog.favorites', { count: 1 })).toBe('1 favorite product');
  });

  describe('sans Intl.PluralRules (Hermes)', () => {
    const originalPluralRules = Intl.PluralRules;

    afterEach(() => {
      Object.defineProperty(Intl, 'PluralRules', { value: originalPluralRules, configurable: true, writable: true });
    });

    it('donne les bons pluriels grâce aux clés `_zero`', async () => {
      // @ts-expect-error simule Hermes, où `Intl.PluralRules` n'existe pas
      delete Intl.PluralRules;
      const withoutPluralRules = createInstance();
      await withoutPluralRules.init({ ...i18nOptions, lng: 'fr' });

      expect(withoutPluralRules.t('stock.units', { count: 0 })).toBe('0 unité');
      expect(withoutPluralRules.t('stock.units', { count: 1 })).toBe('1 unité');
      expect(withoutPluralRules.t('stock.units', { count: 2 })).toBe('2 unités');

      await withoutPluralRules.changeLanguage('en');

      expect(withoutPluralRules.t('stock.units', { count: 0 })).toBe('0 units');
      expect(withoutPluralRules.t('stock.units', { count: 1 })).toBe('1 unit');
      expect(withoutPluralRules.t('stock.units', { count: 2 })).toBe('2 units');
    });
  });

  it('insère les valeurs par interpolation, sans échapper les apostrophes', async () => {
    await i18n.changeLanguage('fr');
    expect(i18n.t('catalog.deleteMessage', { name: "L'huile" })).toBe("« L'huile » sera supprimé de l'inventaire.");

    await i18n.changeLanguage('en');
    expect(i18n.t('catalog.deleteMessage', { name: 'Olive oil' })).toBe('“Olive oil” will be removed from the inventory.');
  });
});

describe('langue', () => {
  it('prend la première langue du téléphone que l’application parle', () => {
    expect(getDeviceLanguage([locale('de'), locale('en'), locale('fr')])).toBe('en');
  });

  it('retombe sur le français quand aucune langue du téléphone n’est gérée', () => {
    expect(getDeviceLanguage([locale('de'), locale(null)])).toBe('fr');
  });

  it('suit le téléphone pour « Système » et obéit au choix explicite sinon', () => {
    expect(resolveLanguage('system', [locale('en')])).toBe('en');
    expect(resolveLanguage('fr', [locale('en')])).toBe('fr');
    expect(resolveLanguage('en', [locale('fr')])).toBe('en');
  });
});

describe('formats', () => {
  it('formate les nombres selon la langue', () => {
    expect(formatNumber(5000, 'en')).toBe('5,000');
    // En français, le séparateur des milliers est une espace insécable (fine ou non, selon la version d'ICU).
    expect(formatNumber(5000, 'fr')).toMatch(/^5\s000$/u);
  });

  it('formate les dates selon la langue', () => {
    const date = new Date('2026-11-24T10:30:00');

    expect(formatDateTime(date, 'fr')).toContain('24/11/2026');
    expect(formatDateTime(date, 'en')).toContain('11/24/26');
  });
});
