import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles, type Theme } from '@/theme';

/** Props typées : `subtitle` est optionnel grâce au `?`. */
interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Élément optionnel affiché à gauche du titre (ex. bouton retour de la fiche). */
  left?: ReactNode;
}

/**
 * En-tête de l'application.
 * Composant de présentation : il ne gère aucun état, il affiche ses props.
 * Ses couleurs viennent du thème (`header`, `onHeader`) : il reste sombre dans les deux modes.
 * Il respecte l'encoche, la Dynamic Island et la barre d'état de chaque appareil.
 */
export default function Header(props: HeaderProps) {
  const { title, subtitle, left } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  // Hauteur de l'encoche / Dynamic Island / barre d'état, propre à chaque appareil.
  const insets = useSafeAreaInsets();
  // En paysage, l'encoche passe sur un côté : on écarte aussi le texte à gauche et à droite.
  const safePadding = {
    paddingTop: insets.top + theme.spacing.md,
    paddingLeft: insets.left + theme.spacing.lg,
    paddingRight: insets.right + theme.spacing.lg,
  };

  return (
    <View style={[styles.container, safePadding]}>
      <View style={styles.row}>
        {left}
        <View style={styles.texts}>
          {/* numberOfLines : un nom de produit trop long est tronqué au lieu de pousser l'en-tête */}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {/* Rendu conditionnel : rien n'est affiché si subtitle est absent */}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

// Fonction définie hors du composant : sa référence est stable, les styles
// ne sont recréés que lorsque le thème change.
const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    container: {
      paddingBottom: spacing.lg,
      backgroundColor: colors.header,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    texts: {
      flex: 1, // le titre prend la place laissée par l'élément de gauche
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
