import { FlatList, StyleSheet, Text, View } from 'react-native';

import Header from '@/shared/components/Header';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import StatTile from '@/shared/components/StatTile';
import useHomeLayout from '../hooks/useHomeLayout';
import useProductFilters from '../hooks/useProductFilters';
import useStockStats from '../hooks/useStockStats';
import { useThemedStyles, type Theme } from '@/theme';
import type { Product } from '../types';

interface CatalogScreenProps {
  products: Product[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  favoritesLabel: string;
  onOpenProduct: (id: string) => void;
}

/** Écran d'accueil : recherche, filtres, tuiles de statistiques et liste responsive du catalogue. */
export default function CatalogScreen(props: CatalogScreenProps) {
  const { products, isFavorite, onToggleFavorite, onAdjustQuantity, favoritesLabel, onOpenProduct } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { insets, columns, cardWidth } = useHomeLayout();
  const { totalCount, lowCount, outCount } = useStockStats(products);
  const { query, setQuery, category, setCategory, filtered } = useProductFilters(products);
  // Safe areas latérales (paysage avec encoche) : filtres et liste s'en écartent.
  const sidePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
  };

  return (
    <View style={styles.screen}>
      <Header title="Scan'Stock" subtitle={favoritesLabel} />

      {/* Hors de la liste : recherche et filtres restent visibles en haut */}
      <View style={[styles.filters, sidePadding]}>
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryChips value={category} onChange={setCategory} />
      </View>

      {/* FlatList est virtualisée : seules les cartes proches de l'écran sont rendues */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={onToggleFavorite}
            onAdjustQuantity={onAdjustQuantity}
            onPress={onOpenProduct}
            style={{ width: cardWidth }}
          />
        )}
        numColumns={columns}
        // FlatList ne sait pas changer de nombre de colonnes à la volée :
        // une nouvelle `key` la reconstruit (rotation, tablette).
        key={columns}
        // Espace entre les deux colonnes ; refusé par FlatList quand il n'y a qu'une colonne.
        columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
        // En-tête de liste : les tuiles et le titre défilent avec les cartes.
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.statsRow}>
              <StatTile label="Produits" value={totalCount} />
              <StatTile label="Stock bas" value={lowCount} tone="warning" />
              <StatTile label="Ruptures" value={outCount} tone="danger" />
            </View>
            <Text style={styles.sectionTitle}>Catalogue</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun produit ne correspond à votre recherche.</Text>}
        contentContainerStyle={[
          styles.content,
          sidePadding,
          // Safe area basse : la dernière carte passe au-dessus de la barre d'accueil iOS.
          { paddingBottom: theme.spacing.lg + insets.bottom },
        ]}
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
      gap: spacing.md,
    },
    content: {
      gap: spacing.md, // espace entre les rangées de cartes
    },
    listHeader: {
      paddingTop: spacing.lg,
      gap: spacing.lg,
    },
    statsRow: {
      flexDirection: 'row', // ⚠️ en React Native, la direction par défaut est 'column'
      gap: spacing.md,
    },
    sectionTitle: {
      ...typography.heading,
      color: colors.text,
    },
    columnRow: {
      gap: spacing.md,
    },
    empty: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: spacing.xxl,
    },
  });
