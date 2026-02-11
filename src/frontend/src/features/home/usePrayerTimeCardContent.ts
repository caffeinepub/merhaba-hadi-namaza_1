import { useMemo } from 'react';
import { versesData, type VerseItem } from './time-content/versesData';
import { hadithsData, type HadithItem } from './time-content/hadithsData';
import { duasData, type DuaItem } from './time-content/duasData';
import { esmaulHusnaData, type EsmaulHusnaItem } from '../esmaulhusna/esmaulHusnaData';
import type { PrayerSlot } from './currentPrayerSlot';

export interface PrayerTimeCardContent {
  verse: VerseItem;
  hadith: HadithItem;
  dua: DuaItem;
  esma: EsmaulHusnaItem;
}

/**
 * Hook that selects random content for each card category.
 * Content remains stable for the same prayer slot.
 */
export function usePrayerTimeCardContent(currentSlot: PrayerSlot | null): PrayerTimeCardContent | null {
  return useMemo(() => {
    if (!currentSlot) return null;

    // Use slot as seed for consistent randomization within the slot
    const slotSeed = getSlotSeed(currentSlot);

    return {
      verse: getRandomItem(versesData, slotSeed, 0),
      hadith: getRandomItem(hadithsData, slotSeed, 1),
      dua: getRandomItem(duasData, slotSeed, 2),
      esma: getRandomItem(esmaulHusnaData, slotSeed, 3)
    };
  }, [currentSlot]);
}

function getSlotSeed(slot: PrayerSlot): number {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const slotIndex = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].indexOf(slot);
  return dayOfYear * 10 + slotIndex;
}

function getRandomItem<T>(array: T[], seed: number, offset: number): T {
  const index = (seed * 7919 + offset * 1009) % array.length;
  return array[index];
}
