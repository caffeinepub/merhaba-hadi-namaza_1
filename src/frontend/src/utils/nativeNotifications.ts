/**
 * Native Notifications Utility
 * 
 * Provides a safe interface for triggering native Android notifications
 * via the WebView JavaScript bridge when available.
 * 
 * Falls back gracefully when the bridge is not available (e.g., in web browsers).
 */

import { GENERIC_NOTIFICATION, getPrayerNotification, type PrayerName } from '@/features/notifications/notificationCopy';

export interface NotificationOptions {
  title: string;
  body: string;
}

/**
 * Sends a native notification via the Android WebView JavaScript bridge.
 * 
 * When running in an Android WebView with the bridge configured, this will
 * trigger a native Android notification. When running in a regular browser
 * or when the bridge is unavailable, it safely no-ops.
 * 
 * @param options - Notification title and body text
 * @returns true if notification was sent, false otherwise
 * 
 * @example
 * ```typescript
 * import { getPrayerNotification } from '@/features/notifications/notificationCopy';
 * 
 * sendNativeNotification(getPrayerNotification('fajr'));
 * ```
 */
export function sendNativeNotification(options: NotificationOptions): boolean {
  const { title, body } = options;

  // Validate inputs
  if (!title || !body) {
    console.warn('[NativeNotifications] Title and body are required');
    return false;
  }

  try {
    // Check if Android bridge is available
    if (
      typeof window !== 'undefined' &&
      window.Android &&
      typeof window.Android.showNotification === 'function'
    ) {
      // Call native Android notification method
      window.Android.showNotification(title, body);
      return true;
    }

    // Bridge not available - running in browser or bridge not configured
    return false;
  } catch (error) {
    // Catch any errors to prevent app crashes
    console.error('[NativeNotifications] Error sending notification:', error);
    return false;
  }
}

/**
 * Sends a generic notification using production copy.
 * 
 * @returns true if notification was sent, false otherwise
 */
export function sendGenericNotification(): boolean {
  return sendNativeNotification(GENERIC_NOTIFICATION);
}

/**
 * Sends a prayer time notification using production copy.
 * 
 * @param prayerName - Name of the prayer (fajr, sunrise, dhuhr, asr, maghrib, isha)
 * @returns true if notification was sent, false otherwise
 */
export function sendPrayerNotification(prayerName: PrayerName): boolean {
  return sendNativeNotification(getPrayerNotification(prayerName));
}

/**
 * Checks if native notifications are supported in the current environment.
 * 
 * @returns true if the Android bridge is available, false otherwise
 */
export function isNativeNotificationSupported(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.Android &&
      typeof window.Android.showNotification === 'function'
    );
  } catch {
    return false;
  }
}

/**
 * Gets the app version from the native Android bridge if available.
 * 
 * @returns App version string or null if not available
 */
export function getNativeAppVersion(): string | null {
  try {
    if (
      typeof window !== 'undefined' &&
      window.Android &&
      typeof window.Android.getAppVersion === 'function'
    ) {
      return window.Android.getAppVersion();
    }
    return null;
  } catch (error) {
    console.error('[NativeNotifications] Error getting app version:', error);
    return null;
  }
}

// TypeScript declarations for the Android WebView bridge
declare global {
  interface Window {
    Android?: {
      showNotification(title: string, body: string): void;
      getAppVersion(): string;
    };
  }
}
