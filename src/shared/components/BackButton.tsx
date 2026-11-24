import { Pressable, StyleSheet, Text } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface BackButtonProps {
  onPress: () => void;
}

/** Bouton retour de l'en-tête (fiche produit, y compris pendant son chargement). */
export default function BackButton(props: BackButtonProps) {
  const { onPress } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <Pressable onPress={onPress} style={styles.button} accessibilityRole="button" accessibilityLabel="Retour au catalogue">
      <Text style={styles.back}>‹</Text>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    // Le « ‹ » seul ne fait qu'environ 13 pt de large : on lui donne une zone de 44 × 44 pt.
    button: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
    back: { fontSize: 36, lineHeight: 36, color: colors.onHeader },
  });
