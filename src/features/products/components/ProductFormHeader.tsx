import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemedStyles, type Theme } from '@/theme';

interface ProductFormHeaderProps {
  title: string;
  onCancel: () => void;
  /** Absent pendant le chargement du produit : seul « Annuler » est proposé. */
  onSubmit?: () => void;
  /** Envoi en cours : « Enregistrer » est désactivé (et grisé) jusqu'à la réponse du serveur. */
  isSubmitting?: boolean;
}

/** En-tête de la modale : Annuler — titre — Enregistrer. */
export default function ProductFormHeader(props: ProductFormHeaderProps) {
  const { title, onCancel, onSubmit, isSubmitting = false } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    // SafeAreaView mesure la place réellement masquée : sur iOS, la modale est une feuille
    // sous la barre d'état (aucun écart) ; sur Android, elle occupe tout l'écran.
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
      {/*
        Sur Android, la modale occupe tout l'écran et son en-tête est clair en thème clair :
        « auto » choisit des icônes sombres en thème clair, claires en thème sombre.
        Ce StatusBar s'ajoute à celui du layout racine tant que la modale est affichée.
        Sur iOS, la feuille laisse une bande sombre en haut : on garde les icônes claires du layout.
      */}
      {Platform.OS === 'android' && <StatusBar style="auto" />}
      <Pressable onPress={onCancel} hitSlop={12} style={styles.side} accessibilityRole="button">
        <Text style={styles.action} maxFontSizeMultiplier={HEADER_MAX_FONT_SCALE}>
          Annuler
        </Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header" maxFontSizeMultiplier={HEADER_MAX_FONT_SCALE}>
        {title}
      </Text>
      {/* Sans « Enregistrer », une zone vide de même largeur garde le titre centré. */}
      {onSubmit ? (
        <Pressable
          onPress={onSubmit}
          disabled={isSubmitting}
          hitSlop={12}
          style={[styles.side, styles.sideRight]}
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
        >
          <Text
            style={[styles.action, styles.actionStrong, isSubmitting && styles.actionDisabled]}
            maxFontSizeMultiplier={HEADER_MAX_FONT_SCALE}
          >
            Enregistrer
          </Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
    </SafeAreaView>
  );
}

// Annuler, le titre et Enregistrer se partagent UNE ligne : au-delà de 1,3 le titre disparaît.
const HEADER_MAX_FONT_SCALE = 1.3;

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    // Même largeur des deux côtés : le titre reste centré.
    side: { minWidth: 96, minHeight: 44, justifyContent: 'center' }, // 44 pt de haut : zone tactile minimale
    sideRight: { alignItems: 'flex-end' },
    action: { ...typography.body, color: colors.primary },
    actionStrong: { fontWeight: '700' },
    actionDisabled: { opacity: 0.4 },
    title: { ...typography.bodyStrong, flex: 1, textAlign: 'center', color: colors.text },
  });
