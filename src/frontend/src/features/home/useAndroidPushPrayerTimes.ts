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
 * - dailyPrayers: array of formatted strings for today's prayers
 * - weeklyPrayers: array of formatted strings for the week's prayers (7 days with all prayer times)
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

    // Build dailyPrayers array
    const dailyPrayers = [
      `İmsak: ${adjustedTimes.fajr}`,
      `Güneş: ${adjustedTimes.sunrise}`,
      `Öğle: ${adjustedTimes.dhuhr}`,
      `İkindi: ${adjustedTimes.asr}`,
      `Akşam: ${adjustedTimes.maghrib}`,
      `Yatsı: ${adjustedTimes.isha}`
    ];

    // Build weeklyPrayers array with all prayer times per day
    const weeklyPrayers = adjustedWeeklyTimes.map(day => {
      return `${day.dayLabel} | İmsak: ${day.fajr}, Güneş: ${day.sunrise}, Öğle: ${day.dhuhr}, İkindi: ${day.asr}, Akşam: ${day.maghrib}, Yatsı: ${day.isha}`;
    });

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
