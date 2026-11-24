/**
 * Palette de Scan'Stock — inspirée de la charte React Native
 * (cyan #61DAFB sur fond anthracite #20232A).
 *
 * On ne manipule jamais une couleur « en dur » dans un composant :
 * on passe par un nom sémantique (background, text, primary…).
 * Changer de thème = changer d'objet, sans toucher aux composants.
 */
export interface ColorTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  header: string;
  onHeader: string;
  onHeaderMuted: string;
  success: string;
  warning: string;
  danger: string;
  onStatus: string;
  favorite: string;
}

export const lightColors: ColorTokens = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F4',
  border: '#DADDE1',
  text: '#20232A',
  textMuted: '#5F6368',
  primary: '#087EA4', // cyan foncé : contraste suffisant sur fond blanc
  onPrimary: '#FFFFFF',
  primarySoft: '#E8F8FD',
  header: '#20232A',
  onHeader: '#61DAFB',
  onHeaderMuted: '#C9D1D9', // texte secondaire de l'en-tête, qui reste sombre dans les deux thèmes
  success: '#188038',
  warning: '#B26200',
  danger: '#D93025',
  onStatus: '#FFFFFF', // texte posé sur un badge de statut
  favorite: '#C48A07', // ambre foncé : 3,01:1 sur fond blanc (le minimum WCAG pour une icône est 3:1)
};

export const darkColors: ColorTokens = {
  background: '#16181D',
  surface: '#20232A',
  surfaceMuted: '#2B2F38',
  border: '#3A3F4B',
  text: '#F6F7F9',
  textMuted: '#A8B0BC',
  primary: '#61DAFB', // cyan vif : lisible sur fond sombre
  onPrimary: '#16181D',
  primarySoft: '#1E3A44',
  header: '#0E1014',
  onHeader: '#61DAFB',
  onHeaderMuted: '#C9D1D9',
  success: '#5BC27A',
  warning: '#F2A541',
  danger: '#F28B82',
  onStatus: '#16181D', // statuts clairs en sombre : texte foncé pour rester lisible
  favorite: '#F6C445',
};
