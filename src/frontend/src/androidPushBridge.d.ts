/**
 * TypeScript declarations for window.AndroidPush interface
 * 
 * This interface is provided by the native Android WebView wrapper
 * to receive expanded prayer-times data for SharedPreferences storage,
 * alarm scheduling, and widget updates.
 */

interface AndroidPushInterface {
  /**
   * Primary method: Sends expanded prayer-times data to Android for SharedPreferences storage,
   * PrayerAlarmReceiver alarm scheduling, and widget updates.
   * 
   * The JSON string must parse to an object containing:
   * - nextPrayer: string (prayer name, e.g., "İmsak", "Öğle", "İkindi", "Akşam", "Yatsı")
   * - nextPrayerMillis: number (epoch timestamp in milliseconds)
   * - nextPrayerTime: string (HH:MM format, e.g., "16:12")
   * - timeRemaining: string (countdown string, e.g., "1 saat 23 dakika")
   * - dailyPrayers: string[] (formatted strings like "İmsak: 06:24")
   * - weeklyPrayers: string[] (formatted strings with all prayer times per day)
   * 
   * Android will:
   * 1. Store the JSON in SharedPreferences
   * 2. Schedule an alarm for nextPrayerMillis
   * 3. Display notifications with prayer name and countdown
   * 4. Update widgets with daily and weekly prayer times
   * 
   * Example payload:
   * ```json
   * {
   *   "nextPrayer": "İkindi",
   *   "nextPrayerMillis": 1739550000000,
   *   "nextPrayerTime": "16:12",
   *   "timeRemaining": "1 saat 23 dakika",
   *   "dailyPrayers": [
   *     "İmsak: 06:24",
   *     "Güneş: 07:49",
   *     "Öğle: 13:19",
   *     "İkindi: 16:12",
   *     "Akşam: 18:40",
   *     "Yatsı: 20:00"
   *   ],
   *   "weeklyPrayers": [
   *     "14 Şubat Cumartesi | İmsak: 06:24, Güneş: 07:49, Öğle: 13:19, İkindi: 16:12, Akşam: 18:40, Yatsı: 20:00",
   *     "15 Şubat Pazar | İmsak: 06:23, Güneş: 07:48, Öğle: 13:19, İkindi: 16:13, Akşam: 18:41, Yatsı: 20:01"
   *   ]
   * }
   * ```
   * 
   * @param jsonData - JSON string containing the expanded prayer-times payload
   */
  sendPrayerTimes?(jsonData: string): void;

  /**
   * Alternative fallback method: Some Android implementations may use this method name
   * instead of `sendPrayerTimes`. The web app will attempt `sendPrayerTimes` first,
   * then fall back to `send` if available.
   * 
   * Accepts the same JSON payload format as `sendPrayerTimes`.
   * 
   * @param jsonData - JSON string containing the expanded prayer-times payload
   */
  send?(jsonData: string): void;
}

interface Window {
  AndroidPush?: AndroidPushInterface;
}
