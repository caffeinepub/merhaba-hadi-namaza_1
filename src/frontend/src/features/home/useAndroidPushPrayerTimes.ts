import { useEffect, useRef } from 'react';
import { sendPrayerTimesToAndroidPush } from '@/utils/androidBridge';
import type { PrayerTimes } from '../prayer/aladhanApi';
import type { DailyPrayerTimes } from '../prayer/aladhanWeeklyApi';

/**
 * React hook that sends expanded prayer-times payload to AndroidPush interface.
 * 
 * Computes and sends a JSON payload with:
 * - nextPrayer: name of the next prayer
 * - nextPrayerMillis: epoch timestamp for the next prayer
 * - nextPrayerTime: HH:MM time string for the next prayer
 * - timeRemaining: countdown string (e.g., "1 saat 23 dakika")
 * - dailyPrayers: array of objects { name, time, timeMillis } for today's prayers
 * - weeklyPrayers: array of objects { name, time, timeMillis } for the week's prayers (7 days with all prayer times)
 * 
 * Updates are deduplicated by comparing the last-sent JSON string.
 */
export function useAndroidPushPrayerTimes(
  adjustedTimes: PrayerTimes | null,
  adjustedWeeklyTimes: DailyPrayerTimes[],
  nextPrayerName: string | null,
  nextPrayerMillis: number | null,
  timeRemaining: string | null
) {
  const lastSentPayloadRef = useRef<string | null>(null);

  useEffect(() => {
    // Only send if we have all required fields
    if (!nextPrayerName || !nextPrayerMillis || !timeRemaining || !adjustedTimes) {
      return;
    }

    // Extract nextPrayerTime from adjustedTimes
    const prayerTimeMap: Record<string, string> = {
      'İmsak': adjustedTimes.fajr,
      'Güneş': adjustedTimes.sunrise,
      'Öğle': adjustedTimes.dhuhr,
      'İkindi': adjustedTimes.asr,
      'Akşam': adjustedTimes.maghrib,
      'Yatsı': adjustedTimes.isha
    };
    const nextPrayerTime = prayerTimeMap[nextPrayerName] || '';

    // Validate nextPrayerTime is non-empty and in HH:MM format
    if (!nextPrayerTime || !/^\d{2}:\d{2}$/.test(nextPrayerTime)) {
      console.warn('[useAndroidPushPrayerTimes] Invalid nextPrayerTime:', nextPrayerTime);
      return;
    }

    // Helper to parse HH:MM and compute timeMillis for today
    const parseTimeToMillis = (timeStr: string): number => {
      const match = /^(\d{2}):(\d{2})$/.exec(timeStr);
      if (!match) return 0;
      
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
      return targetDate.getTime();
    };

    // Build dailyPrayers array with objects
    const dailyPrayers = [
      { name: 'İmsak', time: adjustedTimes.fajr, timeMillis: parseTimeToMillis(adjustedTimes.fajr) },
      { name: 'Güneş', time: adjustedTimes.sunrise, timeMillis: parseTimeToMillis(adjustedTimes.sunrise) },
      { name: 'Öğle', time: adjustedTimes.dhuhr, timeMillis: parseTimeToMillis(adjustedTimes.dhuhr) },
      { name: 'İkindi', time: adjustedTimes.asr, timeMillis: parseTimeToMillis(adjustedTimes.asr) },
      { name: 'Akşam', time: adjustedTimes.maghrib, timeMillis: parseTimeToMillis(adjustedTimes.maghrib) },
      { name: 'Yatsı', time: adjustedTimes.isha, timeMillis: parseTimeToMillis(adjustedTimes.isha) }
    ];

    // Build weeklyPrayers array with objects (all prayer times for next 7 days)
    const weeklyPrayers: Array<{ name: string; time: string; timeMillis: number }> = [];
    const today = new Date();
    
    adjustedWeeklyTimes.forEach((day, dayIndex) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayIndex);
      
      const parseTimeForDay = (timeStr: string): number => {
        const match = /^(\d{2}):(\d{2})$/.exec(timeStr);
        if (!match) return 0;
        
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        
        const dateWithTime = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
          hours,
          minutes,
          0,
          0
        );
        return dateWithTime.getTime();
      };

      // Add all six prayer times for this day
      weeklyPrayers.push(
        { name: 'İmsak', time: day.fajr, timeMillis: parseTimeForDay(day.fajr) },
        { name: 'Güneş', time: day.sunrise, timeMillis: parseTimeForDay(day.sunrise) },
        { name: 'Öğle', time: day.dhuhr, timeMillis: parseTimeForDay(day.dhuhr) },
        { name: 'İkindi', time: day.asr, timeMillis: parseTimeForDay(day.asr) },
        { name: 'Akşam', time: day.maghrib, timeMillis: parseTimeForDay(day.maghrib) },
        { name: 'Yatsı', time: day.isha, timeMillis: parseTimeForDay(day.isha) }
      );
    });

    // Validate all timeMillis are valid
    const allDailyValid = dailyPrayers.every(p => p.timeMillis > 0);
    const allWeeklyValid = weeklyPrayers.every(p => p.timeMillis > 0);

    if (!allDailyValid || !allWeeklyValid) {
      console.warn('[useAndroidPushPrayerTimes] Some timeMillis values are invalid, skipping send');
      return;
    }

    // Compose the full payload
    const payload = {
      nextPrayer: nextPrayerName,
      nextPrayerMillis: nextPrayerMillis,
      nextPrayerTime: nextPrayerTime,
      timeRemaining: timeRemaining,
      dailyPrayers: dailyPrayers,
      weeklyPrayers: weeklyPrayers
    };

    // Stringify for comparison
    const payloadJson = JSON.stringify(payload);

    // Deduplicate: only send if payload changed
    if (payloadJson === lastSentPayloadRef.current) {
      return;
    }

    // Send to AndroidPush
    const success = sendPrayerTimesToAndroidPush(payload);

    if (success) {
      lastSentPayloadRef.current = payloadJson;
    }
  }, [adjustedTimes, adjustedWeeklyTimes, nextPrayerName, nextPrayerMillis, timeRemaining]);
}
