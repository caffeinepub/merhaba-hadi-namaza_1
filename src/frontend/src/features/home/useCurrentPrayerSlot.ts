import { useState, useEffect } from 'react';
import { getCurrentPrayerSlot, type PrayerSlot, type AdjustedPrayerTimes } from './currentPrayerSlot';

/**
 * Hook that tracks the current prayer slot and updates when it changes.
 * Checks every minute for slot changes.
 */
export function useCurrentPrayerSlot(adjustedTimes: AdjustedPrayerTimes | null): PrayerSlot | null {
  const [currentSlot, setCurrentSlot] = useState<PrayerSlot | null>(null);

  useEffect(() => {
    if (!adjustedTimes) {
      setCurrentSlot(null);
      return;
    }

    // Initial calculation
    const slot = getCurrentPrayerSlot(adjustedTimes);
    setCurrentSlot(slot);

    // Update every minute
    const interval = setInterval(() => {
      const newSlot = getCurrentPrayerSlot(adjustedTimes);
      setCurrentSlot(prev => {
        // Only update if slot actually changed
        if (prev !== newSlot) {
          return newSlot;
        }
        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [adjustedTimes]);

  return currentSlot;
}
