import { Image, StyleSheet, Text, View } from 'react-native';

import { categoryLabels, type Product } from '../types/product';
import { getStockStatus } from '../utils/stock';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
}

/**
 * Carte produit, en lecture seule.
 * Le statut n'est pas stocké dans les données : il se déduit de la quantité
 * et du seuil à chaque rendu, il ne peut donc jamais être désynchronisé.
 */
export default function ProductCard(props: ProductCardProps) {
  const { product } = props;
  const status = getStockStatus(product.quantity, product.minQuantity);

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
        <StockBadge status={status} quantity={product.quantity} />
      </View>
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
    flex: 1, // prend toute la largeur restante à droite de l'image
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
});
