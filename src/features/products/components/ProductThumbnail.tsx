import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface ProductThumbnailProps {
  size: number;
}

/**
 * Vignette de produit de la maquette : une icône de colis sur fond neutre.
 * Elle remplace l'image provisoire du Jour 1 ; au Jour 3, elle affichera
 * la photo prise avec la caméra.
 */
export default function ProductThumbnail(props: ProductThumbnailProps) {
  const { size } = props;
  const { theme, styles } = useThemedStyles(createStyles);

  return (
    // La taille varie selon l'écran (carte ou fiche) : elle s'ajoute au style de base.
    <View style={[styles.thumbnail, { width: size, height: size }]}>
      <Ionicons name="cube-outline" size={Math.round(size * 0.45)} color={theme.colors.textMuted} />
    </View>
  );
}

const createStyles = ({ colors, radius }: Theme) =>
  StyleSheet.create({
    thumbnail: {
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
