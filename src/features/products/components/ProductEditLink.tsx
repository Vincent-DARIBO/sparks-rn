import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme';

interface ProductEditLinkProps {
  productId: string;
}

/** Bouton Modifier : navigation déclarative, comme un <a href> sur le web. */
export default function ProductEditLink(props: ProductEditLinkProps) {
  const { productId } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    // asChild : le Link transmet sa navigation au Pressable, qui fournit la zone tactile
    // (icône de 24 + hitSlop de 10 de chaque côté = 44 pt, la taille minimale recommandée).
    // `role` (et non accessibilityRole) : le Link pose role="link", seul `role` le remplace.
    <Link href={{ pathname: '/product/[id]/edit', params: { id: productId } }} asChild>
      <Pressable hitSlop={10} role="button" accessibilityLabel={t('product.edit')}>
        <Ionicons name="create-outline" size={24} color={colors.onHeader} />
      </Pressable>
    </Link>
  );
}
