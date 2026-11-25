import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface BackButtonProps {
  onPress: () => void;
}

/** Bouton retour de l'en-tête (fiche produit, y compris pendant son chargement). */
export default function BackButton(props: BackButtonProps) {
  const { onPress } = props;
  const { styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} hitSlop={12} accessibilityLabel={t('common.backToCatalog')}>
      <Text style={styles.back}>‹</Text>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    back: { fontSize: 36, lineHeight: 36, color: colors.onHeader },
  });
