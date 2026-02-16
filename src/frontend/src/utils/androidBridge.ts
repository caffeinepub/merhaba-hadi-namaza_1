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
 * Sends expanded prayer-times payload to AndroidPush interface for SharedPreferences
 * storage, alarm scheduling, and widget updates.
 * 
 * Attempts primary method `sendPrayerTimes` first, then falls back to alternative
 * method names (e.g., `send`) if available, ensuring maximum compatibility with
 * different Android bridge implementations.
 * 
 * @param payload - Object containing next prayer info, countdown, daily prayers, and weekly prayers
 * @returns true if the bridge call succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * sendPrayerTimesToAndroidPush({
 *   nextPrayer: "İkindi",
 *   nextPrayerMillis: 1739550000000,
 *   nextPrayerTime: "16:12",
 *   timeRemaining: "1 saat 23 dakika",
 *   dailyPrayers: [
 *     { name: "İmsak", time: "06:24", timeMillis: 1739500000000 },
 *     { name: "Güneş", time: "07:49", timeMillis: 1739505000000 },
 *     { name: "Öğle", time: "13:19", timeMillis: 1739525000000 },
 *     { name: "İkindi", time: "16:12", timeMillis: 1739550000000 },
 *     { name: "Akşam", time: "18:40", timeMillis: 1739560000000 },
 *     { name: "Yatsı", time: "20:00", timeMillis: 1739565000000 }
 *   ],
 *   weeklyPrayers: [
 *     { name: "İmsak", time: "06:24", timeMillis: 1739500000000 },
 *     { name: "Güneş", time: "07:49", timeMillis: 1739505000000 },
 *     ...
 *   ]
 * });
 * ```
 */
export function sendPrayerTimesToAndroidPush(payload: {
  nextPrayer: string;
  nextPrayerMillis: number;
  nextPrayerTime: string;
  timeRemaining: string;
  dailyPrayers: Array<{ name: string; time: string; timeMillis: number }>;
  weeklyPrayers: Array<{ name: string; time: string; timeMillis: number }>;
}): boolean {
  // Validate payload structure
  if (!payload || typeof payload !== 'object') {
    console.warn('[AndroidBridge] Invalid payload object');
    return false;
  }

  // Validate required fields
  if (!payload.nextPrayer || typeof payload.nextPrayer !== 'string') {
    console.warn('[AndroidBridge] Invalid nextPrayer:', payload.nextPrayer);
    return false;
  }

  if (typeof payload.nextPrayerMillis !== 'number' || payload.nextPrayerMillis <= 0) {
    console.warn('[AndroidBridge] Invalid nextPrayerMillis:', payload.nextPrayerMillis);
    return false;
  }

  // Validate nextPrayerTime is non-empty and in HH:MM format
  if (!payload.nextPrayerTime || typeof payload.nextPrayerTime !== 'string' || !/^\d{2}:\d{2}$/.test(payload.nextPrayerTime)) {
    console.warn('[AndroidBridge] Invalid nextPrayerTime:', payload.nextPrayerTime, '(expected non-empty HH:MM)');
    return false;
  }

  if (!payload.timeRemaining || typeof payload.timeRemaining !== 'string') {
    console.warn('[AndroidBridge] Invalid timeRemaining:', payload.timeRemaining);
    return false;
  }

  if (!Array.isArray(payload.dailyPrayers) || payload.dailyPrayers.length === 0) {
    console.warn('[AndroidBridge] Invalid dailyPrayers: must be a non-empty array');
    return false;
  }

  if (!Array.isArray(payload.weeklyPrayers) || payload.weeklyPrayers.length === 0) {
    console.warn('[AndroidBridge] Invalid weeklyPrayers: must be a non-empty array');
    return false;
  }

  // Validate each dailyPrayers entry
  for (const entry of payload.dailyPrayers) {
    if (!entry || typeof entry !== 'object') {
      console.warn('[AndroidBridge] Invalid dailyPrayers entry: not an object', entry);
      return false;
    }
    if (!entry.name || typeof entry.name !== 'string') {
      console.warn('[AndroidBridge] Invalid dailyPrayers entry: missing or invalid name', entry);
      return false;
    }
    if (!entry.time || typeof entry.time !== 'string' || !/^\d{2}:\d{2}$/.test(entry.time)) {
      console.warn('[AndroidBridge] Invalid dailyPrayers entry: time must be HH:MM', entry);
      return false;
    }
    if (typeof entry.timeMillis !== 'number' || entry.timeMillis <= 0) {
      console.warn('[AndroidBridge] Invalid dailyPrayers entry: timeMillis must be positive number', entry);
      return false;
    }
  }

  // Validate each weeklyPrayers entry
  for (const entry of payload.weeklyPrayers) {
    if (!entry || typeof entry !== 'object') {
      console.warn('[AndroidBridge] Invalid weeklyPrayers entry: not an object', entry);
      return false;
    }
    if (!entry.name || typeof entry.name !== 'string') {
      console.warn('[AndroidBridge] Invalid weeklyPrayers entry: missing or invalid name', entry);
      return false;
    }
    if (!entry.time || typeof entry.time !== 'string' || !/^\d{2}:\d{2}$/.test(entry.time)) {
      console.warn('[AndroidBridge] Invalid weeklyPrayers entry: time must be HH:MM', entry);
      return false;
    }
    if (typeof entry.timeMillis !== 'number' || entry.timeMillis <= 0) {
      console.warn('[AndroidBridge] Invalid weeklyPrayers entry: timeMillis must be positive number', entry);
      return false;
    }
  }

  try {
    // Stringify payload once
    const jsonPayload = JSON.stringify(payload);

    // Check if AndroidPush interface is available
    if (typeof window !== 'undefined' && window.AndroidPush) {
      // Try primary method: sendPrayerTimes
      if (typeof window.AndroidPush.sendPrayerTimes === 'function') {
        window.AndroidPush.sendPrayerTimes(jsonPayload);
        return true;
      }

      // Fallback: try alternative method name 'send'
      if (typeof window.AndroidPush.send === 'function') {
        window.AndroidPush.send(jsonPayload);
        return true;
      }
    }

    // Bridge not available - running in browser
    return false;
  } catch (error) {
    console.error('[AndroidBridge] Error sending prayer times to AndroidPush:', error);
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

/**
 * Checks if the AndroidPush interface is supported.
 * 
 * @returns true if the AndroidPush interface is available, false otherwise
 */
export function isAndroidPushInterfaceSupported(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      window.AndroidPush !== undefined &&
      (typeof window.AndroidPush.sendPrayerTimes === 'function' ||
       typeof window.AndroidPush.send === 'function')
    );
  } catch {
    return false;
  }
}
