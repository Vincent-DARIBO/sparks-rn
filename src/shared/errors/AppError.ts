/**
 * Erreur de l'application.
 *  - `message` : texte technique, pour le développeur (journaux) ;
 *  - `userMessage` : texte en français, affichable tel quel à l'écran ;
 *  - `code` : identifiant stable, pour réagir à un cas précis (ex. « not_found ») ;
 *  - `technicalDetails` : l'erreur d'origine, gardée pour le débogage.
 */
export class AppError extends Error {
  public readonly code?: string;
  public readonly userMessage: string;
  public readonly technicalDetails?: unknown;

  constructor(message: string, userMessage: string, code?: string, technicalDetails?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.userMessage = userMessage;
    this.code = code;
    this.technicalDetails = technicalDetails;
  }
}
