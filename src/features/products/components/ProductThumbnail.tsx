import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import usePhotoFallback from '../hooks/usePhotoFallback';

interface ProductThumbnailProps {
  size: number;
  /** Photo du produit ; sans photo (ou si elle ne se charge pas), l'icône de colis de la maquette. */
  photoUri?: string;
}

/** Vignette de produit : sa photo, ou une icône de colis sur fond neutre. */
export default function ProductThumbnail(props: ProductThumbnailProps) {
  const { size, photoUri } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { showPhoto, handlePhotoError } = usePhotoFallback(photoUri);
  // La taille varie selon l'écran (carte ou fiche) : elle s'ajoute au style de base.
  const sizeStyle = { width: size, height: size };

  if (showPhoto) {
    // Une image chargée depuis une adresse doit TOUJOURS avoir une taille explicite.
    // La vignette accompagne le nom du produit : le lecteur d'écran n'a pas à l'annoncer.
    return (
      <Image
        source={{ uri: photoUri }}
        onError={handlePhotoError}
        style={[styles.thumbnail, sizeStyle]}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.thumbnail, sizeStyle]}>
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
