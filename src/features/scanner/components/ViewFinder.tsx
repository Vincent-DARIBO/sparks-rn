import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

// Surimpression de la caméra : texte blanc sur l'image filmée, dans les deux thèmes.
const CAMERA_OVERLAY_TEXT = '#FFFFFF';

/** Cadre de visée et consigne, posés sur la caméra. Ils laissent passer les appuis (`pointerEvents`). */
export default function ViewFinder() {
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.frame} />
      <Text style={styles.hint}>Placez le code-barres dans le cadre</Text>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    frame: { width: 280, height: 190, borderWidth: 4, borderColor: colors.onHeader, borderRadius: 12 },
    hint: { ...typography.bodyStrong, color: CAMERA_OVERLAY_TEXT, marginTop: spacing.xl, textAlign: 'center' },
  });
