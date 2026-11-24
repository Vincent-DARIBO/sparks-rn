import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Header from '@/shared/components/Header';
import ProductCard from '../components/ProductCard';
import StatTile from '@/shared/components/StatTile';
import useHomeLayout from '../hooks/useHomeLayout';
import useStockStats from '../hooks/useStockStats';
import { useThemedStyles, type Theme } from '@/theme';
import type { Product } from '../types';

interface CatalogScreenProps {
  products: Product[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  favoritesLabel: string;
  onOpenProduct: (id: string) => void;
}

/** Écran d'accueil : tuiles de statistiques et grille responsive du catalogue. */
export default function CatalogScreen(props: CatalogScreenProps) {
  const { products, isFavorite, onToggleFavorite, favoritesLabel, onOpenProduct } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { insets, cardWidth } = useHomeLayout();
  const { totalCount, lowCount, outCount } = useStockStats(products);

  return (
    <View style={styles.screen}>
      <Header title="Scan'Stock" subtitle={favoritesLabel} />

      {/* Une View ne défile pas : ScrollView suffit pour 12 éléments ; FlatList / FlashList au Module 4 */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            // Safe areas latérales (paysage avec encoche) et basse (barre d'accueil iOS).
            paddingLeft: theme.spacing.lg + insets.left,
            paddingRight: theme.spacing.lg + insets.right,
            paddingBottom: theme.spacing.lg + insets.bottom,
          },
        ]}
      >
        <View style={styles.statsRow}>
          <StatTile label="Produits" value={totalCount} />
          <StatTile label="Stock bas" value={lowCount} tone="warning" />
          <StatTile label="Ruptures" value={outCount} tone="danger" />
        </View>

        <Text style={styles.sectionTitle}>Catalogue</Text>

        {/* flexWrap : les cartes passent à la ligne quand la largeur est atteinte */}
        <View style={styles.grid}>
          {products.map((product) => (
            // `key` : identifiant stable pour que React suive chaque élément.
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={onToggleFavorite}
              onPress={onOpenProduct}
              style={{ width: cardWidth }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
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
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
  });
