import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/shared/components/Header';
import { useThemedStyles, type Theme } from '@/theme';

import SegmentedControl from '../components/SegmentedControl';
import SettingsRow from '../components/SettingsRow';
import SettingsSection from '../components/SettingsSection';
import UpdateStatus from '../components/UpdateStatus';
import useSettings from '../hooks/useSettings';

/** Écran Réglages de la maquette : Apparence, Scanner, Langue, Général. */
export default function SettingsScreen() {
  const { theme, styles } = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const {
    themeOptions,
    themeMode,
    setThemeMode,
    languageOptions,
    language,
    setLanguage,
    vibrateOnScan,
    setVibrateOnScan,
    openAfterScan,
    setOpenAfterScan,
    versionLabel,
  } = useSettings();
  const insets = useSafeAreaInsets();
  // En paysage, l'encoche passe sur un côté : le contenu s'en écarte.
  const sidePadding = {
    paddingLeft: theme.spacing.lg + insets.left,
    paddingRight: theme.spacing.lg + insets.right,
  };

  return (
    <View style={styles.screen}>
      <Header title={t('settings.title')} subtitle={t('settings.subtitle')} />
      <ScrollView contentContainerStyle={[styles.content, sidePadding]}>
        <SettingsSection title={t('settings.appearance')} isCard={false}>
          <SegmentedControl
            label={t('settings.theme')}
            options={themeOptions}
            value={themeMode}
            onChange={setThemeMode}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.scanner')}>
          {/* `accessibilityLabel` : le lecteur d'écran annonce « Vibration au scan, interrupteur, activé ». */}
          <SettingsRow label={t('settings.vibrate')} hasSeparator>
            <Switch value={vibrateOnScan} onValueChange={setVibrateOnScan} accessibilityLabel={t('settings.vibrate')} />
          </SettingsRow>
          <SettingsRow label={t('settings.openAfterScan')}>
            <Switch
              value={openAfterScan}
              onValueChange={setOpenAfterScan}
              accessibilityLabel={t('settings.openAfterScan')}
            />
          </SettingsRow>
        </SettingsSection>

        {/* « Système » suit la langue du téléphone ; le choix est enregistré et s'applique tout de suite. */}
        <SettingsSection title={t('settings.language')} isCard={false}>
          <SegmentedControl
            label={t('settings.language')}
            options={languageOptions}
            value={language}
            onChange={setLanguage}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.general')}>
          <SettingsRow label={t('settings.version')} hasSeparator>
            <Text style={styles.valueText}>{versionLabel}</Text>
          </SettingsRow>
          <UpdateStatus />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors, spacing, typography }: Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.xl },
    valueText: { ...typography.body, color: colors.textMuted },
  });
