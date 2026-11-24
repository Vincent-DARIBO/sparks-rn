import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Header from '@/shared/components/Header';
import { useThemedStyles, type Theme } from '@/theme';

interface CameraPermissionPromptProps {
  canAskAgain: boolean;
  onPress: () => void;
}

/** Autorisation refusée (ou pas encore demandée) : on explique pourquoi, et on propose la bonne action. */
export default function CameraPermissionPrompt(props: CameraPermissionPromptProps) {
  const { canAskAgain, onPress } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const buttonLabel = canAskAgain ? "Autoriser l'appareil photo" : 'Ouvrir les réglages';

  return (
    <View style={styles.screen}>
      <Header title="Scanner" />
      <View style={styles.body}>
        <Ionicons name="camera-outline" size={64} color={theme.colors.textMuted} />
        <Text style={styles.message}>
          Scan&apos;Stock utilise l&apos;appareil photo pour lire les codes-barres. Aucune image n&apos;est enregistrée.
        </Text>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={buttonLabel} style={styles.button}>
          <Text style={styles.buttonLabel}>{buttonLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
    message: { ...typography.body, color: colors.text, textAlign: 'center' },
    button: {
      minHeight: 44,
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    buttonLabel: { ...typography.bodyStrong, color: colors.onPrimary },
  });
