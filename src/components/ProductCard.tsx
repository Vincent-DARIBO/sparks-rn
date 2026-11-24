import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import useStock from '../hooks/useStock';
import { categoryLabels, type Product } from '../types/product';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  /** Callback remonté au parent : c'est lui qui possède l'état des favoris. */
  onToggleFavorite: (id: string) => void;
}

/**
 * Carte produit.
 *
 * - La QUANTITÉ est un état local à la carte (hook useStock) : aucun autre
 *   composant n'en a besoin pour l'instant.
 * - Les FAVORIS sont un état du parent (App) : il les compte dans l'en-tête.
 *   La carte reçoit la valeur en prop et signale les changements par callback.
 *   → Les données descendent, les événements remontent.
 */
export default function ProductCard(props: ProductCardProps) {
  const { product, isFavorite, onToggleFavorite } = props;
  const { quantity, status, increment, decrement } = useStock(
    product.quantity,
    product.minQuantity,
  );

  return (
    <View style={styles.card}>
      {/* Image locale provisoire : require() est résolu au moment du build par Metro */}
      <Image source={require('../../assets/icon.png')} style={styles.thumbnail} />

      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{categoryLabels[product.category]}</Text>
        <StockBadge status={status} quantity={quantity} />

        <View style={styles.actions}>
          <Pressable
            style={styles.stepper}
            onPress={decrement}
            disabled={quantity === 0}
            accessibilityLabel="Retirer une unité"
          >
            <Text style={styles.stepperLabel}>−</Text>
          </Pressable>
          <Pressable style={styles.stepper} onPress={increment} accessibilityLabel="Ajouter une unité">
            <Text style={styles.stepperLabel}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => onToggleFavorite(product.id)}
        hitSlop={12} // agrandit la zone tactile sans changer la taille visuelle
        accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Text style={styles.favorite}>{isFavorite ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  body: {
    flex: 1, // prend toute la largeur restante entre l'image et l'étoile
    gap: 4,
  },
  brand: {
    fontSize: 12,
    color: '#5F6368',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#20232A',
  },
  category: {
    fontSize: 12,
    color: '#5F6368',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  stepper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F8FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#087EA4',
  },
  favorite: {
    fontSize: 24,
    color: '#E3A008',
  },
});
