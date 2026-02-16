/**
 * TypeScript declarations for window.AndroidPush interface
 * 
 * This interface is provided by the native Android WebView wrapper
 * to receive expanded prayer-times data for SharedPreferences storage,
 * alarm scheduling, and widget updates.
 */

interface PrayerTimeEntry {
  name: string;
  time: string;
  timeMillis: number;
}

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
   * - dailyPrayers: array of objects { name: string, time: string, timeMillis: number }
   * - weeklyPrayers: array of objects { name: string, time: string, timeMillis: number }
   * 
   * Android will:
   * 1. Store the JSON in SharedPreferences
   * 2. Parse dailyPrayers and weeklyPrayers as JSONArray of JSONObject
   * 3. Schedule alarms for upcoming prayers using timeMillis
   * 4. Display notifications with prayer name and countdown
   * 5. Update widgets with daily and weekly prayer times
   * 6. Update persistent notification by finding next prayer from arrays
   * 
   * Example payload:
   * ```json
   * {
   *   "nextPrayer": "İkindi",
   *   "nextPrayerMillis": 1739550000000,
   *   "nextPrayerTime": "16:12",
   *   "timeRemaining": "1 saat 23 dakika",
   *   "dailyPrayers": [
   *     { "name": "İmsak", "time": "06:24", "timeMillis": 1739500000000 },
   *     { "name": "Güneş", "time": "07:49", "timeMillis": 1739505000000 },
   *     { "name": "Öğle", "time": "13:19", "timeMillis": 1739525000000 },
   *     { "name": "İkindi", "time": "16:12", "timeMillis": 1739550000000 },
   *     { "name": "Akşam", "time": "18:40", "timeMillis": 1739560000000 },
   *     { "name": "Yatsı", "time": "20:00", "timeMillis": 1739565000000 }
   *   ],
   *   "weeklyPrayers": [
   *     { "name": "İmsak", "time": "06:24", "timeMillis": 1739500000000 },
   *     { "name": "Güneş", "time": "07:49", "timeMillis": 1739505000000 },
   *     { "name": "Öğle", "time": "13:19", "timeMillis": 1739525000000 },
   *     { "name": "İkindi", "time": "16:12", "timeMillis": 1739550000000 },
   *     { "name": "Akşam", "time": "18:40", "timeMillis": 1739560000000 },
   *     { "name": "Yatsı", "time": "20:00", "timeMillis": 1739565000000 },
   *     { "name": "İmsak", "time": "06:23", "timeMillis": 1739586000000 },
   *     ...
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
