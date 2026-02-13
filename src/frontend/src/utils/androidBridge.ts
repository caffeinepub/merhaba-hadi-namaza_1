/**
 * Android Bridge Utility
 * 
 * Provides safe helpers for calling Android WebView bridge methods
 * when available, with graceful fallback for web browsers.
 */

/**
 * Sends the next prayer information to the Android native layer
 * for persistent notification countdown display.
 * 
 * This function now delegates to the global updateNextPrayerWidget function
 * provided by the standalone android-widget-bridge.js script.
 * 
 * @param prayerName - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
 * @param timeMillis - Unix timestamp in milliseconds for the next prayer occurrence
 * @returns true if the bridge call succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * const nextPrayerTime = new Date();
 * nextPrayerTime.setHours(13, 30, 0, 0);
 * sendNextPrayerToAndroid("Öğle", nextPrayerTime.getTime());
 * ```
 */
export function sendNextPrayerToAndroid(prayerName: string, timeMillis: number): boolean {
  // Validate inputs
  if (!prayerName || typeof prayerName !== 'string') {
    console.warn('[AndroidBridge] Invalid prayer name:', prayerName);
    return false;
  }

  if (typeof timeMillis !== 'number' || timeMillis <= 0) {
    console.warn('[AndroidBridge] Invalid timestamp:', timeMillis);
    return false;
  }

  try {
    // Delegate to the global widget bridge function
    if (typeof window !== 'undefined' && typeof window.updateNextPrayerWidget === 'function') {
      return window.updateNextPrayerWidget(prayerName, timeMillis);
    }

    // Bridge not available
    return false;
  } catch (error) {
    // Catch any errors to prevent app crashes
    console.error('[AndroidBridge] Error sending next prayer update:', error);
    return false;
  }
}

/**
 * Sends the next prayer information using the AndroidPrayer interface
 * with name and HH:MM time string format.
 * 
 * @param prayerName - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
 * @param timeString - Prayer time in HH:MM format (e.g., "13:30")
 * @returns true if the bridge call succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * sendNextPrayerWithTimeString("Öğle", "13:30");
 * ```
 */
export function sendNextPrayerWithTimeString(prayerName: string, timeString: string): boolean {
  // Validate inputs
  if (!prayerName || typeof prayerName !== 'string') {
    console.warn('[AndroidBridge] Invalid prayer name:', prayerName);
    return false;
  }

  if (!timeString || typeof timeString !== 'string' || !/^\d{2}:\d{2}$/.test(timeString)) {
    console.warn('[AndroidBridge] Invalid time string:', timeString, '(expected HH:MM)');
    return false;
  }

  try {
    // Use AndroidPrayer interface if available
    if (
      typeof window !== 'undefined' &&
      window.AndroidPrayer &&
      typeof window.AndroidPrayer.updateNextPrayer === 'function'
    ) {
      return window.AndroidPrayer.updateNextPrayer(prayerName, timeString);
    }

    // Bridge not available
    return false;
  } catch (error) {
    console.error('[AndroidBridge] Error sending next prayer with time string:', error);
    return false;
  }
}

/**
 * Sends daily prayer times to the Android native layer using the AndroidPrayer interface.
 * 
 * @param dailyPrayers - Array of prayer times with name and HH:MM time
 * @returns true if the bridge call succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * sendDailyPrayersToAndroid([
 *   { name: "İmsak", time: "05:00" },
 *   { name: "Güneş", time: "06:15" },
 *   { name: "Öğle", time: "12:30" },
 *   { name: "İkindi", time: "15:45" },
 *   { name: "Akşam", time: "18:00" },
 *   { name: "Yatsı", time: "19:30" }
 * ]);
 * ```
 */
export function sendDailyPrayersToAndroid(dailyPrayers: Array<{ name: string; time: string }>): boolean {
  // Validate input
  if (!Array.isArray(dailyPrayers)) {
    console.warn('[AndroidBridge] Daily prayers must be an array');
    return false;
  }

  try {
    // Use AndroidPrayer interface if available
    if (
      typeof window !== 'undefined' &&
      window.AndroidPrayer &&
      typeof window.AndroidPrayer.updateDailyPrayers === 'function'
    ) {
      const jsonPayload = JSON.stringify(dailyPrayers);
      return window.AndroidPrayer.updateDailyPrayers(jsonPayload);
    }

    // Bridge not available
    return false;
  } catch (error) {
    console.error('[AndroidBridge] Error sending daily prayers:', error);
    return false;
  }
}

/**
 * Sends city/location display name to the Android native layer using the AndroidPrayer interface.
 * 
 * @param cityName - Display name of the city/location
 * @returns true if the bridge call succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * sendCityToAndroid("Istanbul, Turkey");
 * ```
 */
export function sendCityToAndroid(cityName: string): boolean {
  // Validate input
  if (!cityName || typeof cityName !== 'string') {
    console.warn('[AndroidBridge] Invalid city name:', cityName);
    return false;
  }

  try {
    // Use AndroidPrayer interface if available
    if (
      typeof window !== 'undefined' &&
      window.AndroidPrayer &&
      typeof window.AndroidPrayer.updateCity === 'function'
    ) {
      return window.AndroidPrayer.updateCity(cityName);
    }

    // Bridge not available
    return false;
  } catch (error) {
    console.error('[AndroidBridge] Error sending city:', error);
    return false;
  }
}

/**
 * Checks if the Android bridge for next prayer updates is supported.
 * 
 * @returns true if the updateNextPrayer bridge method is available, false otherwise
 */
export function isNextPrayerBridgeSupported(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.updateNextPrayerWidget === 'function'
    );
  } catch {
    return false;
  }
}

/**
 * Checks if the AndroidPrayer interface is supported.
 * 
 * @returns true if the AndroidPrayer interface is available, false otherwise
 */
export function isAndroidPrayerInterfaceSupported(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      window.AndroidPrayer !== undefined &&
      typeof window.AndroidPrayer.updateNextPrayer === 'function'
    );
  } catch {
    return false;
  }
}

