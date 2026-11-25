import { useTranslation } from 'react-i18next';

import NotFoundScreen from '@/shared/components/NotFoundScreen';

/** Fichier spécial `+not-found` : affiché pour toute adresse sans route correspondante. */
export default function NotFoundRoute() {
  const { t } = useTranslation();
  return <NotFoundScreen message={t('notFound.page')} />;
}
