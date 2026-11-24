import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';
import Header from './Header';

interface NotFoundScreenProps {
  message: string;
}

/** Écran affiché pour une adresse sans route ou un produit introuvable. */
export default function NotFoundScreen(props: NotFoundScreenProps) {
  const { message } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <Header title="Introuvable" />
      <View style={styles.body}>
        <Text style={styles.message}>{message}</Text>
        {/*
          dismissTo : ferme les écrans jusqu'au catalogue s'il est déjà dans la pile (recherche et
          filtre conservés) ; sinon (pile vide après un lien profond), le catalogue remplace cet écran.
        */}
        <Link href="/" dismissTo style={styles.link}>
          Retour au catalogue
        </Link>
      </View>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
    message: { ...typography.body, color: colors.text, textAlign: 'center' },
    link: { ...typography.bodyStrong, color: colors.primary },
  });
