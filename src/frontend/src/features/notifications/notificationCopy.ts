/**
 * Production Notification Copy
 * 
 * Single source of truth for all notification titles and bodies.
 * All strings are production-ready English with placeholder support.
 */

export interface NotificationTemplate {
  title: string;
  body: string;
}

/**
 * Generic web-triggered notification template
 */
export const GENERIC_NOTIFICATION: NotificationTemplate = {
  title: 'Hadi Namaza',
  body: 'You have a new notification from Hadi Namaza',
};

/**
 * Prayer time notification templates
 */
export const PRAYER_NOTIFICATIONS = {
  fajr: {
    title: 'Fajr Prayer Time',
    body: 'It is time for Fajr prayer. May Allah accept your worship.',
  },
  sunrise: {
    title: 'Sunrise',
    body: 'The sun has risen. The time for Fajr prayer has ended.',
  },
  dhuhr: {
    title: 'Dhuhr Prayer Time',
    body: 'It is time for Dhuhr prayer. May Allah accept your worship.',
  },
  asr: {
    title: 'Asr Prayer Time',
    body: 'It is time for Asr prayer. May Allah accept your worship.',
  },
  maghrib: {
    title: 'Maghrib Prayer Time',
    body: 'It is time for Maghrib prayer. May Allah accept your worship.',
  },
  isha: {
    title: 'Isha Prayer Time',
    body: 'It is time for Isha prayer. May Allah accept your worship.',
  },
} as const;

export type PrayerName = keyof typeof PRAYER_NOTIFICATIONS;

/**
 * Get notification template for a specific prayer
 */
export function getPrayerNotification(prayerName: PrayerName): NotificationTemplate {
  return PRAYER_NOTIFICATIONS[prayerName];
}

/**
 * Format prayer notification with optional time and lead minutes
 */
export function formatPrayerNotification(
  prayerName: PrayerName,
  options?: {
    time?: string;
    leadMinutes?: number;
  }
): NotificationTemplate {
  const template = getPrayerNotification(prayerName);
  
  if (!options) {
    return template;
  }

  let body = template.body;

  // Add time if provided
  if (options.time) {
    body = `${body} Prayer time: ${options.time}`;
  }

  // Add lead time if provided
  if (options.leadMinutes && options.leadMinutes > 0) {
    body = `Reminder: ${body.replace('It is time', `${options.leadMinutes} minutes until`)}`;
  }

  return {
    title: template.title,
    body,
  };
}
