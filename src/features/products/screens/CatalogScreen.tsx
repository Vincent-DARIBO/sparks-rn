import { FlashList } from '@shopify/flash-list';
import { StyleSheet, Text, View } from 'react-native';

import Header from '@/shared/components/Header';
import CatalogListHeader from '../components/CatalogListHeader';
import CategoryChips from '../components/CategoryChips';
import SearchBar from '../components/SearchBar';
import useCatalog from '../hooks/useCatalog';
import useCatalogRenderItem from '../hooks/useCatalogRenderItem';
import { useThemedStyles, type Theme } from '@/theme';
import type { Product } from '../types';

interface CatalogScreenProps {
  products: Product[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  favoritesCount: number;
  onAdjustQuantity: (id: string, delta: number) => void;
  onOpenProduct: (id: string) => void;
  /** Démo de performances : bascule entre les produits de départ et 5 000 produits. */
  isLargeDataset: boolean;
  onToggleLargeDataset: (value: boolean) => void;
}

/** Écran d'accueil : recherche, filtres, tuiles de statistiques et catalogue en FlashList. */
export default function CatalogScreen(props: CatalogScreenProps) {
  const {
    products,
    isFavorite,
    onToggleFavorite,
    favoritesCount,
    onAdjustQuantity,
    onOpenProduct,
    isLargeDataset,
    onToggleLargeDataset,
  } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { insets, columns, stats, favoritesLabel, query, setQuery, category, setCategory, filtered } =
    useCatalog(products, favoritesCount);
  const { renderItem } = useCatalogRenderItem({
    columns,
    isFavorite,
    onToggleFavorite,
    onAdjustQuantity,
    onOpenProduct,
  });
  // Safe areas latérales (paysage avec encoche) : filtres et liste s'en écartent.
  const sidePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
  };
  // En deux colonnes, chaque cellule ajoute une demi-marge de chaque côté : on la retire ici
  // pour que les cartes restent alignées sur les filtres.
  const cellSideOffset = columns > 1 ? theme.spacing.md / 2 : 0;

  return (
    <View style={styles.screen}>
      <Header title="Scan'Stock" subtitle={favoritesLabel} />

      {/* Hors de la liste : recherche et filtres restent visibles en haut */}
      <View style={[styles.filters, sidePadding]}>
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryChips value={category} onChange={setCategory} />
      </View>

      {/*
        FlashList RECYCLE les cellules : une cellule sortie de l'écran est réutilisée
        pour un autre produit. Un état local dans la carte suivrait donc la cellule,
        pas le produit : la quantité vient de l'inventaire (useInventory).
      */}
      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={columns}
        // Changer de nombre de colonnes : une nouvelle `key` reconstruit la liste (rotation, tablette).
        key={columns}
        // En-tête de liste : les tuiles et le titre défilent avec les cartes.
        ListHeaderComponent={
          <CatalogListHeader
            stats={stats}
            isLargeDataset={isLargeDataset}
            onToggleLargeDataset={onToggleLargeDataset}
          />
        }
        // L'en-tête n'est pas une cellule : il récupère la demi-marge retirée ci-dessous.
        ListHeaderComponentStyle={{ paddingHorizontal: cellSideOffset }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun produit ne correspond à votre recherche.</Text>}
        contentContainerStyle={{
          paddingLeft: sidePadding.paddingLeft - cellSideOffset,
          paddingRight: sidePadding.paddingRight - cellSideOffset,
          // Safe area basse : la dernière carte passe au-dessus de la barre d'accueil iOS.
          paddingBottom: theme.spacing.lg + insets.bottom,
        }}
        // Clavier : il se ferme quand on fait défiler, et un appui sur une
        // carte fonctionne du premier coup même clavier ouvert.
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    filters: {
      paddingTop: spacing.lg,
      // Bande libre sous les pastilles : la liste est coupée à son bord supérieur,
      // une carte à moitié défilée ne vient donc pas toucher les pastilles.
      paddingBottom: spacing.sm,
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    empty: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: spacing.xxl,
    },
  });
