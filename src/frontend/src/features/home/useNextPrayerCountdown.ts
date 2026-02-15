import { useState, useEffect, useRef } from 'react';
import { sendNextPrayerToAndroid, sendNextPrayerWithTimeString } from '@/utils/androidBridge';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface NextPrayer {
  name: string;
  time: string;
}

interface NextPrayerCountdownResult {
  nextPrayer: NextPrayer | null;
  nextPrayerMillis: number | null;
  timeRemaining: string;
}

/**
 * React hook computing next prayer from adjusted times with live countdown.
 * 
 * This hook can be called from parent components (like HomeTab) to provide
 * a single source of truth for next prayer computation.
 * 
 * Updates every minute and sends legacy bridge calls for backward compatibility.
 * Exposes nextPrayerMillis for AndroidPush integration.
 * 
 * @param adjustedTimes - Prayer times with offsets applied
 * @returns Object with nextPrayer, nextPrayerMillis, and timeRemaining
 */
export function useNextPrayerCountdown(adjustedTimes: PrayerTimes | null): NextPrayerCountdownResult {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [nextPrayerMillis, setNextPrayerMillis] = useState<number | null>(null);
  
  // Track last sent prayer to avoid excessive bridge calls
  const lastSentTimestampRef = useRef<{ name: string; timestamp: number } | null>(null);
  const lastSentTimeStringRef = useRef<{ name: string; time: string } | null>(null);

  useEffect(() => {
    if (!adjustedTimes) {
      setNextPrayer(null);
      setNextPrayerMillis(null);
      setTimeRemaining('');
      return;
    }

    const prayers = [
      { name: 'İmsak', time: adjustedTimes.fajr },
      { name: 'Güneş', time: adjustedTimes.sunrise },
      { name: 'Öğle', time: adjustedTimes.dhuhr },
      { name: 'İkindi', time: adjustedTimes.asr },
      { name: 'Akşam', time: adjustedTimes.maghrib },
      { name: 'Yatsı', time: adjustedTimes.isha }
    ];

    const updateCountdown = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find next prayer
      let foundNext: NextPrayer | null = null;
      let nextTimestamp = 0;

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;

        if (prayerMinutes > currentMinutes) {
          foundNext = prayer;
          const nextDate = new Date(now);
          nextDate.setHours(hours, minutes, 0, 0);
          nextTimestamp = nextDate.getTime();
          break;
        }
      }

      // If no prayer found today, use first prayer of tomorrow
      if (!foundNext) {
        foundNext = prayers[0];
        const [hours, minutes] = foundNext.time.split(':').map(Number);
        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(hours, minutes, 0, 0);
        nextTimestamp = nextDate.getTime();
      }

      setNextPrayer(foundNext);
      setNextPrayerMillis(nextTimestamp);

      // Calculate time remaining
      const diff = nextTimestamp - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hoursLeft > 0) {
        setTimeRemaining(`${hoursLeft} sa ${minutesLeft} dk`);
      } else {
        setTimeRemaining(`${minutesLeft} dk`);
      }

      // Send legacy bridge updates only when next prayer changes
      if (foundNext) {
        // Legacy timestamp-based update
        const lastSent = lastSentTimestampRef.current;
        if (!lastSent || lastSent.name !== foundNext.name || lastSent.timestamp !== nextTimestamp) {
          sendNextPrayerToAndroid(foundNext.name, nextTimestamp);
          lastSentTimestampRef.current = { name: foundNext.name, timestamp: nextTimestamp };
        }

        // New time-string-based update
        const lastSentTimeString = lastSentTimeStringRef.current;
        if (!lastSentTimeString || lastSentTimeString.name !== foundNext.name || lastSentTimeString.time !== foundNext.time) {
          sendNextPrayerWithTimeString(foundNext.name, foundNext.time);
          lastSentTimeStringRef.current = { name: foundNext.name, time: foundNext.time };
        }
      }
    };

    // Initial update
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [adjustedTimes]);

  return { nextPrayer, nextPrayerMillis, timeRemaining };
}
