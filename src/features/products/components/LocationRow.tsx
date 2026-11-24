import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles, type Theme } from '@/theme';

import type { ProductLocation } from '../types';

interface LocationRowProps {
  location: ProductLocation | undefined;
  isLocating: boolean;
  onRecordLocation: () => void;
  onOpenLocation: (location: ProductLocation) => void;
}

/** Ligne « Emplacement » de la fiche : l'adresse enregistrée (touchable) et le bouton d'enregistrement. */
export default function LocationRow(props: LocationRowProps) {
  const { location, isLocating, onRecordLocation, onOpenLocation } = props;
  const { theme, styles } = useThemedStyles(createStyles);
  const buttonLabel = location ? 'Mettre à jour avec ma position' : "Enregistrer l'emplacement ici";

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Emplacement</Text>
        {location ? (
          <Pressable
            onPress={() => onOpenLocation(location)}
            accessibilityRole="link"
            accessibilityHint="Affiche cet emplacement dans Google Maps"
            style={styles.address}
          >
            <Text style={[styles.value, styles.link]}>{location.label}</Text>
          </Pressable>
        ) : (
          <Text style={[styles.value, styles.muted]}>Non renseigné</Text>
        )}
      </View>
      <Pressable
        onPress={onRecordLocation}
        disabled={isLocating}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
        accessibilityState={{ busy: isLocating, disabled: isLocating }}
        style={styles.button}
      >
        {isLocating ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
        )}
        <Text style={[styles.link, styles.buttonText]}>{buttonLabel}</Text>
      </Pressable>
    </>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    // flexWrap : avec un très grand texte, l'adresse passe sous le libellé au lieu d'être écrasée.
    row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
    label: { ...typography.body, color: colors.textMuted },
    // Zone tactile de 44 pt de haut (le texte en fait environ 19) ; la marge négative de 12 pt
    // en haut et en bas évite d'agrandir la ligne. `marginLeft: 'auto'` garde l'adresse à droite.
    address: { flexShrink: 1, minHeight: 44, justifyContent: 'center', marginVertical: -12, marginLeft: 'auto' },
    value: { ...typography.bodyStrong, color: colors.text, textAlign: 'right' },
    link: { ...typography.bodyStrong, color: colors.primary },
    muted: { color: colors.textMuted, fontWeight: '400' },
    // flexWrap + flexShrink : avec un très grand texte, le libellé passe sous l'icône et prend toute la largeur.
    button: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
    buttonText: { flexShrink: 1 },
  });
