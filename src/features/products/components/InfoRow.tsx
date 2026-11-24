import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

interface InfoRowProps {
  label: string;
  value: string;
}

/** Petit composant : une ligne « libellé — valeur ». */
export default function InfoRow(props: InfoRowProps) {
  const { label, value } = props;
  const { styles } = useThemedStyles(createStyles);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    // flexWrap : avec un très grand texte, la valeur passe sous le libellé au lieu d'être écrasée.
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
    infoLabel: { ...typography.body, color: colors.textMuted },
    infoValue: { ...typography.bodyStrong, color: colors.text, flexShrink: 1, marginLeft: 'auto', textAlign: 'right' },
  });
