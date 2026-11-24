import NotFoundScreen from '@/shared/components/NotFoundScreen';

/** Fichier spécial `+not-found` : affiché pour toute adresse sans route correspondante. */
export default function NotFoundRoute() {
  return <NotFoundScreen message="Cette page n'existe pas." />;
}
