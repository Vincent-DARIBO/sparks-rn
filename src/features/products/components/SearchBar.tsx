import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

/** Champ de recherche de la maquette : loupe, saisie, bouton d'effacement. */
export default function SearchBar(props: SearchBarProps) {
  const { value, onChangeText } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('catalog.search')}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        // Pas de majuscule ni de correction automatique pour une recherche.
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        // On affiche notre propre bouton d'effacement, identique sur iOS et Android.
        clearButtonMode="never"
        accessibilityLabel={t('catalog.search')}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('catalog.clearSearch')}
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius }: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      // Zone tactile minimale recommandée.
      height: 44,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
    },
    input: {
      flex: 1,
      // 16 minimum : sinon iOS zoome sur le champ dans certains contextes web.
      fontSize: 16,
      color: colors.text,
      // Android ajoute un padding vertical par défaut.
      paddingVertical: 0,
    },
  });
