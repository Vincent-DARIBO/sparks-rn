import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useProductEditRoute from '@/features/products/hooks/useProductEditRoute';
import { useThemedStyles, type Theme } from '@/theme';

/**
 * Route `/product/[id]/edit`, présentée en MODALE (option du layout racine).
 * Pour l'instant, la modale n'affiche que son en-tête : le formulaire arrive au ticket suivant.
 */
export default function EditProductRoute() {
  const { product, close } = useProductEditRoute();
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      {/*
        Sur Android, la modale occupe tout l'écran et son en-tête est clair en thème clair :
        « auto » choisit des icônes sombres en thème clair, claires en thème sombre.
        Ce StatusBar s'ajoute à celui du layout racine tant que la modale est affichée.
        Sur iOS, la feuille laisse une bande sombre en haut : on garde les icônes claires du layout.
      */}
      {Platform.OS === 'android' && <StatusBar style="auto" />}
      {/*
        SafeAreaView mesure la place réellement masquée : sur iOS, la modale est une feuille
        sous la barre d'état (aucun écart) ; sur Android, elle occupe tout l'écran.
      */}
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <Pressable onPress={close} hitSlop={12} style={styles.side} accessibilityRole="button">
          <Text style={styles.cancel}>Annuler</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          Modifier le produit
        </Text>
        {/* Case vide de même largeur que « Annuler » : le titre reste centré */}
        <View style={styles.side} />
      </SafeAreaView>

      <View style={styles.body}>
        <Text style={styles.message}>
          {product ? `Le formulaire de « ${product.name} » arrive au prochain ticket.` : 'Produit introuvable.'}
        </Text>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    side: { minWidth: 88 },
    cancel: { ...typography.body, color: colors.primary },
    title: { ...typography.bodyStrong, flex: 1, textAlign: 'center', color: colors.text },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    message: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  });
