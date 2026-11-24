import * as Haptics from 'expo-haptics';

import { HapticsError } from './HapticsError';

const FEEDBACK_TYPES = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
};

export type HapticFeedback = keyof typeof FEEDBACK_TYPES;

/** Retour haptique (vibration) : un accès au matériel du téléphone, donc un service. */
export class HapticsService {
  static async notify(feedback: HapticFeedback): Promise<void> {
    try {
      await Haptics.notificationAsync(FEEDBACK_TYPES[feedback]);
    } catch (error) {
      throw HapticsError.notifyFailed(error);
    }
  }
}
