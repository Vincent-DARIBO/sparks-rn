import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/shared/components/Header';
import { useThemedStyles, type Theme } from '@/theme';

import SegmentedControl from '../components/SegmentedControl';
import SettingsRow from '../components/SettingsRow';
import SettingsSection from '../components/SettingsSection';
import useSettings, { themeOptions } from '../hooks/useSettings';

/** Écran Réglages de la maquette : Apparence, Scanner, Général. */
export default function SettingsScreen() {
  const { theme, styles } = useThemedStyles(createStyles);
  const {
    themeMode,
    setThemeMode,
    vibrateOnScan,
    setVibrateOnScan,
    openAfterScan,
    setOpenAfterScan,
    versionLabel,
    updateLabel,
  } = useSettings();
  const insets = useSafeAreaInsets();
  // En paysage, l'encoche passe sur un côté : le contenu s'en écarte.
  const sidePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
  };

  return (
    <View style={styles.screen}>
      <Header title="Réglages" subtitle="Préférences enregistrées sur cet appareil" />
      <ScrollView contentContainerStyle={[styles.content, sidePadding]}>
        <SettingsSection title="Apparence" isCard={false}>
          <SegmentedControl label="Thème" options={themeOptions} value={themeMode} onChange={setThemeMode} />
        </SettingsSection>

        <SettingsSection title="Scanner">
          {/* `accessibilityLabel` : le lecteur d'écran annonce « Vibration au scan, interrupteur, activé ». */}
          <SettingsRow label="Vibration au scan" hasSeparator>
            <Switch value={vibrateOnScan} onValueChange={setVibrateOnScan} accessibilityLabel="Vibration au scan" />
          </SettingsRow>
          <SettingsRow label="Ouvrir la fiche après le scan">
            <Switch
              value={openAfterScan}
              onValueChange={setOpenAfterScan}
              accessibilityLabel="Ouvrir la fiche après le scan"
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Général">
          {/* Une seule langue pour l'instant : la ligne n'est pas encore un bouton. */}
          <SettingsRow label="Langue" hasSeparator>
            <View style={styles.value}>
              <Text style={styles.valueText}>Français</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
            </View>
          </SettingsRow>
          <SettingsRow label="Version" hasSeparator>
            <Text style={styles.valueText}>{versionLabel}</Text>
          </SettingsRow>
          <SettingsRow label="Mise à jour">
            <Text style={styles.valueText}>{updateLabel}</Text>
          </SettingsRow>
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.xl },
    value: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    valueText: { ...typography.body, color: colors.textMuted },
  });
