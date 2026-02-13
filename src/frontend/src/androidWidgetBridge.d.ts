/**
 * TypeScript declarations for Android Widget Bridge global functions.
 * 
 * These functions are provided by the standalone android-widget-bridge.js script
 * and are available globally after the script loads.
 */

interface DailyPrayerItem {
  name: string;
  time: string;
}

interface WeeklyPrayerDay {
  day: string;
  times: DailyPrayerItem[];
}

/**
 * AndroidPrayer interface for sending prayer data to native Android widgets.
 * This interface provides methods that send prayer times with HH:MM format strings.
 */
interface AndroidPrayerInterface {
  /**
   * Updates the next prayer with name and time string (HH:MM format).
   * 
   * @param name - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
   * @param time - Prayer time in HH:MM format (e.g., "13:30")
   * @returns true if the bridge call succeeded, false otherwise
   */
  updateNextPrayer(name: string, time: string): boolean;

  /**
   * Updates daily prayer times with all six prayers.
   * 
   * @param jsonPayload - JSON string containing array of {name, time} objects
   * @returns true if the bridge call succeeded, false otherwise
   */
  updateDailyPrayers(jsonPayload: string): boolean;

  /**
   * Updates the city/location display name.
   * 
   * @param cityName - Display name of the city/location
   * @returns true if the bridge call succeeded, false otherwise
   */
  updateCity(cityName: string): boolean;
}

declare global {
  interface Window {
    /**
     * Updates the "Next Prayer" widget with the upcoming prayer information.
     * 
     * @param prayerName - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
     * @param timestamp - Unix timestamp in milliseconds for the next prayer
     * @returns true if the bridge call succeeded, false otherwise
     */
    updateNextPrayerWidget(prayerName: string, timestamp: number): boolean;

    /**
     * Updates the "Daily Prayers" widget with today's prayer times.
     * 
     * @param dailyList - Array of prayer times for today
     * @returns true if the bridge call succeeded, false otherwise
     */
    updateDailyPrayersWidget(dailyList: DailyPrayerItem[]): boolean;

    /**
     * Updates the "Weekly Prayers" widget with the next 7 days of prayer times.
     * 
     * @param weeklyList - Array of daily prayer times for the week
     * @returns true if the bridge call succeeded, false otherwise
     */
    updateWeeklyPrayersWidget(weeklyList: WeeklyPrayerDay[]): boolean;

    /**
     * AndroidPrayer interface for sending prayer data to native Android widgets.
     * Provides methods that use HH:MM time strings instead of timestamps.
     */
    AndroidPrayer: AndroidPrayerInterface;
  }
}

export {};

