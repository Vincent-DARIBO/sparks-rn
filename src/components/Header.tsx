import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '../theme';

/** Props typées : `subtitle` est optionnel grâce au `?`. */
interface HeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * En-tête de l'application.
 * Composant de présentation : il ne gère aucun état, il affiche ses props.
 * Ses couleurs viennent du thème (`header`, `onHeader`) : il reste sombre dans les deux modes.
 */
export default function Header(props: HeaderProps) {
  const { title, subtitle } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* Rendu conditionnel : rien n'est affiché si subtitle est absent */}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// Fonction définie hors du composant : sa référence est stable, les styles
// ne sont recréés que lorsque le thème change.
const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing.xxl + spacing.xl, // provisoire : remplacé par les safe areas au Module 3
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.header,
    },
    title: {
      ...typography.title,
      color: colors.onHeader,
    },
    subtitle: {
      ...typography.caption,
      color: colors.onHeaderMuted,
      marginTop: spacing.xs,
    },
  });
