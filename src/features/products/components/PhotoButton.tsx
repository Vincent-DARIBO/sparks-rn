import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface PhotoButtonProps {
  hasPhoto: boolean;
  isSaving: boolean;
  onPress: () => void;
}

/** Bouton rond « appareil photo », posé en bas à droite de l'illustration de la fiche. */
export default function PhotoButton(props: PhotoButtonProps) {
  const { hasPhoto, isSaving, onPress } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={isSaving}
      accessibilityRole="button"
      accessibilityLabel={hasPhoto ? t('product.changePhoto') : t('product.addPhoto')}
      accessibilityState={{ busy: isSaving, disabled: isSaving }}
      style={styles.button}
    >
      {isSaving ? (
        <ActivityIndicator color={theme.colors.onHeader} />
      ) : (
        <Ionicons name="camera-outline" size={22} color={theme.colors.onHeader} />
      )}
    </Pressable>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    button: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      // Fond de l'en-tête : reste sombre dans les deux thèmes, lisible sur n'importe quelle photo.
      backgroundColor: colors.header,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
