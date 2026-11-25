import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import usePhotoFallback from '../hooks/usePhotoFallback';
import type { Product } from '../types';
import PhotoButton from './PhotoButton';
import ProductThumbnail from './ProductThumbnail';

interface ProductHeroProps {
  product: Product;
  isSavingPhoto: boolean;
  onChoosePhoto: () => void;
}

/** Illustration de la fiche : la photo du produit (format 16:9), ou l'icône de colis. */
export default function ProductHero(props: ProductHeroProps) {
  const { product, isSavingPhoto, onChoosePhoto } = props;
  const { styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { showPhoto, handlePhotoError } = usePhotoFallback(product.photoUri);

  return (
    // aspectRatio fixe la proportion, la largeur s'adapte à l'écran.
    <View style={styles.hero}>
      {showPhoto ? (
        // `cover` remplit le cadre 16:9 quitte à rogner les bords de la photo.
        <Image
          source={{ uri: product.photoUri }}
          onError={handlePhotoError}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel={t('product.photoOf', { name: product.name })}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <ProductThumbnail size={96} />
      )}
      <PhotoButton hasPhoto={showPhoto} isSaving={isSavingPhoto} onPress={onChoosePhoto} />
    </View>
  );
}

const createStyles = ({ colors, radius }: Theme) =>
  StyleSheet.create({
    hero: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      // La photo suit les coins arrondis du cadre.
      overflow: 'hidden',
    },
  });
