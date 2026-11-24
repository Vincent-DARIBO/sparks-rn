const BARCODE_LENGTH = 13;

/**
 * On ne garde que les chiffres : un collage « 3 017620 422003 » donne « 3017620422003 ».
 *
 * La limite de 13 est appliquée ICI, après le nettoyage, et non par `maxLength` sur le champ :
 * `maxLength` couperait le texte collé AVANT qu'on retire les espaces
 * (« 3 017620 42200 », soit 12 chiffres seulement).
 */
export function sanitizeBarcode(text: string): string {
  return text.replace(/\D/g, '').slice(0, BARCODE_LENGTH);
}
