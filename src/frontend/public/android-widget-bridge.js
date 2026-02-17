/**
 * Android Widget Bridge
 * 
 * Standalone JavaScript bridge for Android WebView widget updates.
 * This file provides global functions and the AndroidPrayer interface
 * for updating prayer time widgets via SharedPreferences.
 * 
 * Usage: Include this script in index.html via <script src="/android-widget-bridge.js"></script>
 * 
 * The widget update functions are:
 * - updateNextPrayerWidget(prayerName, timestamp) [legacy]
 * - updateDailyPrayersWidget(dailyList) [legacy]
 * - updateWeeklyPrayersWidget(weeklyList) [legacy]
 * 
 * The AndroidPrayer interface provides:
 * - updateNextPrayer(name, time) - Next prayer with HH:MM time string
 * - updateDailyPrayers(jsonPayload) - Daily prayer times as JSON string
 * - updateCity(cityName) - City/location display name
 */

(function() {
  'use strict';

  /**
   * Updates the "Next Prayer" widget with the upcoming prayer information.
   * 
   * @param {string} prayerName - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
   * @param {number} timestamp - Unix timestamp in milliseconds for the next prayer
   * @returns {boolean} true if the bridge call succeeded, false otherwise
   * 
   * @example
   * updateNextPrayerWidget("Öğle", 1707825000000);
   */
  window.updateNextPrayerWidget = function(prayerName, timestamp) {
    // Validate inputs
    if (!prayerName || typeof prayerName !== 'string') {
      console.warn('[WidgetBridge] Invalid prayer name:', prayerName);
      return false;
    }

    if (typeof timestamp !== 'number' || timestamp <= 0) {
      console.warn('[WidgetBridge] Invalid timestamp:', timestamp);
      return false;
    }

    try {
      // Check if Android bridge is available
      if (
        typeof window.Android !== 'undefined' &&
        window.Android !== null &&
        typeof window.Android.updateNextPrayer === 'function'
      ) {
        window.Android.updateNextPrayer(prayerName, timestamp);
        return true;
      }

      // Bridge not available - running in browser
      return false;
    } catch (error) {
      console.error('[WidgetBridge] Error updating next prayer widget:', error);
      return false;
    }
  };

  /**
   * Updates the "Daily Prayers" widget with today's prayer times.
   * 
   * @param {Array<{name: string, time: string}>} dailyList - Array of prayer times for today
   * @returns {boolean} true if the bridge call succeeded, false otherwise
   * 
   * @example
   * updateDailyPrayersWidget([
   *   {name: "İmsak", time: "05:00"},
   *   {name: "Güneş", time: "06:15"},
   *   {name: "Öğle", time: "12:30"},
   *   {name: "İkindi", time: "15:45"},
   *   {name: "Akşam", time: "18:00"},
   *   {name: "Yatsı", time: "19:30"}
   * ]);
   */
  window.updateDailyPrayersWidget = function(dailyList) {
    // Validate input
    if (!Array.isArray(dailyList)) {
      console.warn('[WidgetBridge] Daily list must be an array');
      return false;
    }

    // Validate each item has required fields
    for (var i = 0; i < dailyList.length; i++) {
      var item = dailyList[i];
      if (!item.name || typeof item.name !== 'string') {
        console.warn('[WidgetBridge] Invalid prayer name at index', i);
        return false;
      }
      if (!item.time || typeof item.time !== 'string' || !/^\d{2}:\d{2}$/.test(item.time)) {
        console.warn('[WidgetBridge] Invalid time format at index', i, '(expected HH:MM)');
        return false;
      }
    }

    try {
      // Check if Android bridge is available
      if (
        typeof window.Android !== 'undefined' &&
        window.Android !== null &&
        typeof window.Android.updateDailyPrayers === 'function'
      ) {
        var payloadJson = JSON.stringify(dailyList);
        window.Android.updateDailyPrayers(payloadJson);
        return true;
      }

      // Bridge not available - running in browser
      return false;
    } catch (error) {
      console.error('[WidgetBridge] Error updating daily prayers widget:', error);
      return false;
    }
  };

  /**
   * Updates the "Weekly Prayers" widget with the next 7 days of prayer times.
   * 
   * @param {Array<{day: string, times: Array<{name: string, time: string}>}>} weeklyList - Array of daily prayer times for the week
   * @returns {boolean} true if the bridge call succeeded, false otherwise
   * 
   * @example
   * updateWeeklyPrayersWidget([
   *   {
   *     day: "Pazartesi",
   *     times: [
   *       {name: "İmsak", time: "05:00"},
   *       {name: "Güneş", time: "06:15"},
   *       {name: "Öğle", time: "12:30"},
   *       {name: "İkindi", time: "15:45"},
   *       {name: "Akşam", time: "18:00"},
   *       {name: "Yatsı", time: "19:30"}
   *     ]
   *   },
   *   // ... more days
   * ]);
   */
  window.updateWeeklyPrayersWidget = function(weeklyList) {
    // Validate input
    if (!Array.isArray(weeklyList)) {
      console.warn('[WidgetBridge] Weekly list must be an array');
      return false;
    }

    // Validate each day entry
    for (var i = 0; i < weeklyList.length; i++) {
      var dayEntry = weeklyList[i];
      
      if (!dayEntry.day || typeof dayEntry.day !== 'string') {
        console.warn('[WidgetBridge] Invalid day name at index', i);
        return false;
      }

      if (!Array.isArray(dayEntry.times)) {
        console.warn('[WidgetBridge] Times must be an array at index', i);
        return false;
      }

      // Validate each prayer time in the day
      for (var j = 0; j < dayEntry.times.length; j++) {
        var prayer = dayEntry.times[j];
        if (!prayer.name || typeof prayer.name !== 'string') {
          console.warn('[WidgetBridge] Invalid prayer name at day', i, 'prayer', j);
          return false;
        }
        if (!prayer.time || typeof prayer.time !== 'string' || !/^\d{2}:\d{2}$/.test(prayer.time)) {
          console.warn('[WidgetBridge] Invalid time format at day', i, 'prayer', j, '(expected HH:MM)');
          return false;
        }
      }
    }

    try {
      // Check if Android bridge is available
      if (
        typeof window.Android !== 'undefined' &&
        window.Android !== null &&
        typeof window.Android.updateWeeklyPrayers === 'function'
      ) {
        var payloadJson = JSON.stringify(weeklyList);
        window.Android.updateWeeklyPrayers(payloadJson);
        return true;
      }

      // Bridge not available - running in browser
      return false;
    } catch (error) {
      console.error('[WidgetBridge] Error updating weekly prayers widget:', error);
      return false;
    }
  };

  /**
   * AndroidPrayer interface for sending prayer data to native Android widgets.
   * This interface provides methods that match the user's requested API surface.
   */
  window.AndroidPrayer = {
    /**
     * Updates the next prayer with name and time string (HH:MM format).
     * 
     * @param {string} name - Turkish name of the next prayer (e.g., "İmsak", "Öğle")
     * @param {string} time - Prayer time in HH:MM format (e.g., "13:30")
     * @returns {boolean} true if the bridge call succeeded, false otherwise
     */
    updateNextPrayer: function(name, time) {
      // Validate inputs
      if (!name || typeof name !== 'string') {
        console.warn('[AndroidPrayer] Invalid prayer name:', name);
        return false;
      }

      if (!time || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
        console.warn('[AndroidPrayer] Invalid time format:', time, '(expected HH:MM)');
        return false;
      }

      try {
        // Check if Android bridge is available
        if (
          typeof window.Android !== 'undefined' &&
          window.Android !== null &&
          typeof window.Android.updateNextPrayerInfo === 'function'
        ) {
          window.Android.updateNextPrayerInfo(name, time);
          return true;
        }

        // Bridge not available - running in browser
        return false;
      } catch (error) {
        console.error('[AndroidPrayer] Error updating next prayer:', error);
        return false;
      }
    },

    /**
     * Updates daily prayer times with all six prayers.
     * 
     * @param {string} jsonPayload - JSON string containing array of {name, time} objects
     * @returns {boolean} true if the bridge call succeeded, false otherwise
     */
    updateDailyPrayers: function(jsonPayload) {
      // Validate input
      if (!jsonPayload || typeof jsonPayload !== 'string') {
        console.warn('[AndroidPrayer] Invalid JSON payload');
        return false;
      }

      try {
        // Parse to validate JSON structure
        var dailyList = JSON.parse(jsonPayload);
        
        if (!Array.isArray(dailyList)) {
          console.warn('[AndroidPrayer] Payload must be an array');
          return false;
        }

        // Check if Android bridge is available
        if (
          typeof window.Android !== 'undefined' &&
          window.Android !== null &&
          typeof window.Android.updateDailyPrayerTimes === 'function'
        ) {
          window.Android.updateDailyPrayerTimes(jsonPayload);
          return true;
        }

        // Bridge not available - running in browser
        return false;
      } catch (error) {
        console.error('[AndroidPrayer] Error updating daily prayers:', error);
        return false;
      }
    },

    /**
     * Updates the city/location display name.
     * 
     * @param {string} cityName - Display name of the city/location
     * @returns {boolean} true if the bridge call succeeded, false otherwise
     */
    updateCity: function(cityName) {
      // Validate input
      if (!cityName || typeof cityName !== 'string') {
        console.warn('[AndroidPrayer] Invalid city name:', cityName);
        return false;
      }

      try {
        // Check if Android bridge is available
        if (
          typeof window.Android !== 'undefined' &&
          window.Android !== null &&
          typeof window.Android.updateCityName === 'function'
        ) {
          window.Android.updateCityName(cityName);
          return true;
        }

        // Bridge not available - running in browser
        return false;
      } catch (error) {
        console.error('[AndroidPrayer] Error updating city:', error);
        return false;
      }
    }
  };

  // Log bridge initialization
  if (typeof window.Android !== 'undefined' && window.Android !== null) {
    console.log('[WidgetBridge] Android bridge detected, widget updates enabled');
  }
})();

