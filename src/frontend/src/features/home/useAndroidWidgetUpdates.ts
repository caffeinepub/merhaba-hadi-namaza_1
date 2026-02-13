import { useEffect, useRef } from 'react';
import type { PrayerTimes } from '../prayer/aladhanApi';
import type { DailyPrayerTimes } from '../prayer/aladhanWeeklyApi';
import { sendDailyPrayersToAndroid, sendCityToAndroid } from '@/utils/androidBridge';

/**
 * React hook that sends daily and weekly prayer times to Android widgets.
 * 
 * This hook computes the required payload formats and calls the global
 * widget bridge functions provided by android-widget-bridge.js.
 * 
 * Updates are sent only when the computed payloads actually change,
 * preventing unnecessary bridge calls on every render.
 */
export function useAndroidWidgetUpdates(
  adjustedTimes: PrayerTimes | null,
  adjustedWeeklyTimes: DailyPrayerTimes[],
  cityName?: string
) {
  // Track last sent payloads to avoid duplicate sends
  const lastDailyRef = useRef<string | null>(null);
  const lastWeeklyRef = useRef<string | null>(null);
  const lastCityRef = useRef<string | null>(null);

  useEffect(() => {
    // Send daily prayer times update (legacy widget bridge)
    if (adjustedTimes) {
      const dailyList = [
        { name: 'İmsak', time: adjustedTimes.fajr },
        { name: 'Güneş', time: adjustedTimes.sunrise },
        { name: 'Öğle', time: adjustedTimes.dhuhr },
        { name: 'İkindi', time: adjustedTimes.asr },
        { name: 'Akşam', time: adjustedTimes.maghrib },
        { name: 'Yatsı', time: adjustedTimes.isha }
      ];

      const dailyPayload = JSON.stringify(dailyList);

      // Only send if payload changed
      if (dailyPayload !== lastDailyRef.current) {
        try {
          if (typeof window !== 'undefined' && typeof window.updateDailyPrayersWidget === 'function') {
            const success = window.updateDailyPrayersWidget(dailyList);
            if (success) {
              lastDailyRef.current = dailyPayload;
            }
          }
        } catch (error) {
          console.error('[WidgetUpdates] Error sending daily prayers:', error);
        }
      }

      // Send daily prayer times update (new AndroidPrayer interface)
      const dailySuccess = sendDailyPrayersToAndroid(dailyList);
      if (dailySuccess) {
        // Successfully sent via AndroidPrayer interface
      }
    }
  }, [adjustedTimes]);

  useEffect(() => {
    // Send weekly prayer times update (legacy widget bridge)
    if (adjustedWeeklyTimes && adjustedWeeklyTimes.length > 0) {
      const weeklyList = adjustedWeeklyTimes.map((day) => ({
        day: day.dayLabel,
        times: [
          { name: 'İmsak', time: day.fajr },
          { name: 'Güneş', time: day.sunrise },
          { name: 'Öğle', time: day.dhuhr },
          { name: 'İkindi', time: day.asr },
          { name: 'Akşam', time: day.maghrib },
          { name: 'Yatsı', time: day.isha }
        ]
      }));

      const weeklyPayload = JSON.stringify(weeklyList);

      // Only send if payload changed
      if (weeklyPayload !== lastWeeklyRef.current) {
        try {
          if (typeof window !== 'undefined' && typeof window.updateWeeklyPrayersWidget === 'function') {
            const success = window.updateWeeklyPrayersWidget(weeklyList);
            if (success) {
              lastWeeklyRef.current = weeklyPayload;
            }
          }
        } catch (error) {
          console.error('[WidgetUpdates] Error sending weekly prayers:', error);
        }
      }
    }
  }, [adjustedWeeklyTimes]);

  useEffect(() => {
    // Send city name update (new AndroidPrayer interface)
    if (cityName && cityName !== lastCityRef.current) {
      const success = sendCityToAndroid(cityName);
      if (success) {
        lastCityRef.current = cityName;
      }
    }
  }, [cityName]);
}

