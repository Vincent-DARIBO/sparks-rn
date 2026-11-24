import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';
import Header from './Header';

interface PlaceholderScreenProps {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  message: string;
}

/** Écran provisoire : son contenu sera construit lors d'un module ultérieur. */
export default function PlaceholderScreen(props: PlaceholderScreenProps) {
  const { title, icon, message } = props;
  const { theme, styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <Header title={title} />
      <View style={styles.body}>
        <Ionicons name={icon} size={64} color={theme.colors.textMuted} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
    message: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  });
