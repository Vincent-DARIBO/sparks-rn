import { getLocales, type Locale } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useSettingsStore, type LanguagePreference } from '@/shared/stores/settingsStore';

import { en } from './locales/en';
import { fr, type Translations } from './locales/fr';

/**
 * Internationalisation :
 * - expo-localization donne les langues préférées du téléphone ;
 * - i18next choisit le texte, gère l'interpolation ({{name}}) et les pluriels ;
 * - react-i18next fournit le hook `useTranslation()`, qui re-rend l'écran quand la langue change.
 */
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (code: string | null): code is Language =>
  SUPPORTED_LANGUAGES.some((language) => language === code);

/** Première langue du téléphone que l'application sait parler, sinon le français. */
export function getDeviceLanguage(locales: Locale[] = getLocales()): Language {
  for (const { languageCode } of locales) {
    if (isSupportedLanguage(languageCode)) return languageCode;
  }
  return 'fr';
}

/** « Système » suit le téléphone ; « Français » ou « English » s'imposent à lui. */
export function resolveLanguage(preference: LanguagePreference, locales?: Locale[]): Language {
  return preference === 'system' ? getDeviceLanguage(locales) : preference;
}

/** Ressources et options exportées pour que les tests puissent créer une instance identique. */
export const i18nOptions = {
  resources: { fr: { translation: fr }, en: { translation: en } },
  fallbackLng: 'fr',
  // React échappe déjà le texte : sans cette option, « l'inventaire » s'afficherait « l&#39;inventaire ».
  interpolation: { escapeValue: false },
};

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  ...i18nOptions,
  // Le store lit le stockage de façon synchrone : la langue choisie est déjà connue au premier affichage.
  lng: resolveLanguage(useSettingsStore.getState().language),
});

/**
 * Rend les clés de traduction VÉRIFIÉES par TypeScript :
 * `t('catalog.titel')` est une erreur de compilation.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: Translations };
  }
}

export default i18n;
