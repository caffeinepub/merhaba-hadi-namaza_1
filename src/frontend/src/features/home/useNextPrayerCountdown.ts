import { useState, useEffect } from 'react';

interface NextPrayer {
  name: string;
  time: string;
}

interface NextPrayerCountdownResult {
  nextPrayer: NextPrayer | null;
  timeRemaining: string;
}

export function useNextPrayerCountdown(adjustedTimes: any): NextPrayerCountdownResult {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);

  useEffect(() => {
    if (!adjustedTimes) {
      setNextPrayer(null);
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
      let found: NextPrayer | null = null;
      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;

        if (prayerMinutes > currentMinutes) {
          found = prayer;
          break;
        }
      }

      // If no prayer found today, use first prayer of tomorrow
      if (!found) {
        found = prayers[0];
      }

      setNextPrayer(found);

      // Calculate time remaining
      if (found) {
        const [hours, minutes] = found.time.split(':').map(Number);
        let prayerMinutes = hours * 60 + minutes;

        // If prayer is tomorrow, add 24 hours
        if (prayerMinutes <= currentMinutes) {
          prayerMinutes += 24 * 60;
        }

        const diffMinutes = prayerMinutes - currentMinutes;
        const hoursLeft = Math.floor(diffMinutes / 60);
        const minutesLeft = diffMinutes % 60;

        if (hoursLeft > 0) {
          setTimeRemaining(`${hoursLeft} saat ${minutesLeft} dk kaldı`);
        } else {
          setTimeRemaining(`${minutesLeft} dk kaldı`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [adjustedTimes]);

  return { nextPrayer, timeRemaining };
}
