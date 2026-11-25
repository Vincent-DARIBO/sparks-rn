import { useTranslation } from 'react-i18next';

import { formatDateTime, formatNumber } from './format';

/** Les fonctions de `format.ts`, liées à la langue active : l'écran se met à jour quand la langue change. */
export default function useFormatters() {
  const { i18n } = useTranslation();
  return {
    number: (value: number) => formatNumber(value, i18n.language),
    dateTime: (value: Date) => formatDateTime(value, i18n.language),
  };
}
