/**
 * À étaler (`{...hiddenFromScreenReader}`) sur une vue que VoiceOver et TalkBack doivent ignorer,
 * elle ET tout ce qu'elle contient. Deux props, car chaque système a la sienne :
 * `accessibilityElementsHidden` pour iOS, `importantForAccessibility` pour Android.
 * On pose toujours les deux, pour que l'application se comporte pareil partout.
 */
export const hiddenFromScreenReader = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;
