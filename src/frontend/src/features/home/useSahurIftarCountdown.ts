import { useState, useEffect } from 'react';

interface SahurIftarCountdownResult {
  sahurTime: string;
  iftarTime: string;
  targetLabel: string;
  timeRemaining: string;
}

export function useSahurIftarCountdown(
  adjustedTimes: { fajr: string; maghrib: string } | null
): SahurIftarCountdownResult | null {
  const [countdown, setCountdown] = useState<SahurIftarCountdownResult | null>(null);

  useEffect(() => {
    if (!adjustedTimes) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Parse sahur (fajr) and iftar (maghrib) times
      const [fajrHours, fajrMinutes] = adjustedTimes.fajr.split(':').map(Number);
      const [maghribHours, maghribMinutes] = adjustedTimes.maghrib.split(':').map(Number);

      const fajrMinutesOfDay = fajrHours * 60 + fajrMinutes;
      const maghribMinutesOfDay = maghribHours * 60 + maghribMinutes;

      let targetLabel: string;
      let targetMinutes: number;
      let targetDate: Date;

      // Determine target: if between fajr and maghrib, target is iftar (maghrib)
      // Otherwise, target is next sahur (fajr)
      if (currentMinutes >= fajrMinutesOfDay && currentMinutes < maghribMinutesOfDay) {
        // Target is today's iftar
        targetLabel = 'İftara';
        targetMinutes = maghribMinutesOfDay;
        targetDate = new Date();
        targetDate.setHours(maghribHours, maghribMinutes, 0, 0);
      } else {
        // Target is next sahur (tomorrow if after maghrib or before fajr)
        targetLabel = 'Sahura';
        if (currentMinutes >= maghribMinutesOfDay) {
          // After maghrib, target is tomorrow's fajr
          targetMinutes = fajrMinutesOfDay + 24 * 60;
          targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(fajrHours, fajrMinutes, 0, 0);
        } else {
          // Before fajr, target is today's fajr
          targetMinutes = fajrMinutesOfDay;
          targetDate = new Date();
          targetDate.setHours(fajrHours, fajrMinutes, 0, 0);
        }
      }

      // Calculate time remaining
      const diffMinutes = targetMinutes - currentMinutes;
      const hoursLeft = Math.floor(diffMinutes / 60);
      const minutesLeft = diffMinutes % 60;

      let timeRemaining: string;
      if (hoursLeft > 0) {
        timeRemaining = `${hoursLeft} sa ${minutesLeft} dk`;
      } else {
        timeRemaining = `${minutesLeft} dk`;
      }

      setCountdown({
        sahurTime: adjustedTimes.fajr,
        iftarTime: adjustedTimes.maghrib,
        targetLabel,
        timeRemaining,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [adjustedTimes]);

  return countdown;
}
