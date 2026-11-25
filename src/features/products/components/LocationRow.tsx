import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const buttonLabel = location ? t('product.locationUpdate') : t('product.locationRecord');

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>{t('product.location')}</Text>
        {location ? (
          <Pressable
            onPress={() => onOpenLocation(location)}
            accessibilityRole="link"
            accessibilityHint={t('product.locationOpenHint')}
            hitSlop={12} // zone tactile d'au moins 44 pt sans agrandir le texte
            style={styles.address}
          >
            <Text style={[styles.value, styles.link]}>{location.label}</Text>
          </Pressable>
        ) : (
          <Text style={[styles.value, styles.muted]}>{t('product.locationUnknown')}</Text>
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
        <Text style={styles.link}>{buttonLabel}</Text>
      </Pressable>
    </>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
    label: { ...typography.body, color: colors.textMuted },
    address: { flexShrink: 1 },
    value: { ...typography.bodyStrong, color: colors.text, textAlign: 'right' },
    link: { ...typography.bodyStrong, color: colors.primary },
    muted: { color: colors.textMuted, fontWeight: '400' },
    button: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  });
