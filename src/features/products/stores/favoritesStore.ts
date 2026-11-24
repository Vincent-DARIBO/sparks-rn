import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageService } from '@/shared/services/StorageService';

/**
 * Favoris : un ÉTAT CLIENT, propre à cet appareil, jamais envoyé à l'API.
 * Les produits, eux, ne sont PAS ici : ce sont des données SERVEUR. Leur cache,
 * leur rechargement et leur invalidation sont le travail de TanStack Query ;
 * les recopier dans un store créerait deux sources de vérité à synchroniser.
 */
interface FavoritesState {
  // Tableau plutôt que Set : un Set ne se convertit pas en JSON, donc ne s'enregistre pas.
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}

/**
 * `create` renvoie un HOOK : `useFavoritesStore(selecteur)` s'utilise dans un composant
 * comme n'importe quel hook, sans Provider autour de l'application.
 *
 * `persist` enregistre l'état à chaque changement et le relit au démarrage.
 * Le favori de départ (« Pâte à tartiner 400 g », id '1') n'est qu'une valeur par
 * défaut : dès qu'un état a été enregistré, c'est lui qui est relu. Un favori retiré
 * ne revient donc pas au lancement suivant.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: ['1'],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
            : [...state.favoriteIds, id],
        })),
    }),
    // Pas de `partialize` ici : `JSON.stringify` ignore déjà la fonction `toggleFavorite`,
    // seul `favoriteIds` est enregistré. Le store des réglages, lui, utilise `partialize`
    // pour montrer comment choisir EXPLICITEMENT ce qui est persisté.
    { name: 'scanstock-favorites', storage: createJSONStorage(() => StorageService) },
  ),
);

/**
 * Sélecteurs : le composant ne lit QUE la valeur dont il a besoin, et ne se re-rend
 * que si CETTE valeur change. `useIsFavorite('3')` renvoie un booléen : il ne bouge
 * pas quand on touche l'étoile du produit 5, la carte 3 n'est donc pas redessinée.
 */
export const useIsFavorite = (id: string) => useFavoritesStore((state) => state.favoriteIds.includes(id));
// Le compteur compte les identifiants enregistrés, sans chercher dans la liste des produits :
// rien qui puisse échouer. Limite connue : il compte aussi les produits qui ne sont plus affichés
// (produit supprimé du serveur, produit généré par le mode « Démo perfs »).
export const useFavoritesCount = () => useFavoritesStore((state) => state.favoriteIds.length);
// Une action ne change jamais : ce sélecteur ne provoque aucun re-rendu.
export const useToggleFavorite = () => useFavoritesStore((state) => state.toggleFavorite);
