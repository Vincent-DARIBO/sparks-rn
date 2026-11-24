import { StyleSheet, Text, View } from 'react-native';

/** Props typées : `subtitle` est optionnel grâce au `?`. */
interface HeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * En-tête de l'application.
 * Composant de présentation : il ne gère aucun état, il affiche ses props.
 */
export default function Header(props: HeaderProps) {
  const { title, subtitle } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* Rendu conditionnel : rien n'est affiché si subtitle est absent */}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 56, // provisoire : remplacé par les safe areas au Module 3
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#20232A',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#61DAFB',
  },
  subtitle: {
    fontSize: 14,
    color: '#C9D1D9',
    marginTop: 4,
  },
});
