import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { useThemedStyles, type Theme } from '@/theme';

import useDeleteActionStyle, { ACTION_WIDTH } from '../hooks/useDeleteActionStyle';

interface DeleteActionProps {
  translation: SharedValue<number>;
  productName: string;
  onPress: () => void;
}

/** Action rouge révélée sous la carte : « Supprimer » avec une icône corbeille. */
export default function DeleteAction(props: DeleteActionProps) {
  const { translation, productName, onPress } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { containerStyle, iconStyle } = useDeleteActionStyle(translation);

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Supprimer ${productName}`}
        style={styles.action}
      >
        <Animated.View style={[styles.content, iconStyle]}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.onStatus} />
          <Text style={styles.label}>Supprimer</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// `onStatus` : le texte posé sur une couleur de statut (blanc sur le rouge clair, foncé sur le rouge sombre).
const createStyles = ({ colors, spacing, radius, typography }: Theme) =>
  StyleSheet.create({
    action: {
      flex: 1, // toute la hauteur de la carte
      width: ACTION_WIDTH,
      marginLeft: spacing.sm,
      backgroundColor: colors.danger,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: { alignItems: 'center', gap: spacing.xs },
    label: { ...typography.caption, color: colors.onStatus, fontWeight: '600' },
  });
