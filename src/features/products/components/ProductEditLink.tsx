import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

interface ProductEditLinkProps {
  productId: string;
}

/** Bouton Modifier : navigation déclarative, comme un <a href> sur le web. */
export default function ProductEditLink(props: ProductEditLinkProps) {
  const { productId } = props;
  const { colors } = useTheme();

  return (
    // asChild : le Link transmet sa navigation au Pressable, qui fournit la zone tactile
    // (44 × 44 pt, la taille minimale recommandée, autour de l'icône de 24).
    // `role` (et non accessibilityRole) : le Link pose role="link", seul `role` le remplace.
    <Link href={{ pathname: '/product/[id]/edit', params: { id: productId } }} asChild>
      <Pressable style={styles.button} role="button" accessibilityLabel="Modifier le produit">
        <Ionicons name="create-outline" size={24} color={colors.onHeader} />
      </Pressable>
    </Link>
  );
}

// La marge négative compense les 10 pt ajoutés de chaque côté de l'icône : elle reste à sa place.
const styles = StyleSheet.create({
  button: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
});
