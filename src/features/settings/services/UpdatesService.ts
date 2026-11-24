import * as Updates from 'expo-updates';

/** Lit l'état d'expo-updates, la bibliothèque qui sait quel JavaScript tourne dans l'application. */
export class UpdatesService {
  /**
   * Texte de la ligne « Mise à jour » des Réglages.
   * Ces valeurs sont des constantes fixées au lancement : la lecture ne peut pas échouer.
   */
  static getStatusLabel(): string {
    // En développement (Expo Go compris), le JavaScript vient de Metro, pas d'un bundle embarqué.
    // expo-updates est aussi inactif dans un build sans `updates.url`.
    if (__DEV__ || !Updates.isEnabled) return 'Développement';

    const source = Updates.isEmbeddedLaunch ? 'Version intégrée' : 'Mise à jour reçue';
    // `||` et non `??` : un canal vide ('') doit aussi afficher « — ».
    return `${source} · canal ${Updates.channel || '—'}`;
  }
}
