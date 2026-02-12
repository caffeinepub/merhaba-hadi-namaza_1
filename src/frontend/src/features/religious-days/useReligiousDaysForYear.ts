// React hook that returns fixed 2026 religious days with next-up logic

import { useMemo } from 'react';
import { RELIGIOUS_DAYS_2026 } from './religiousDaysData';
import { daysBetweenLocalDays, startOfLocalDay } from './dateMath';
import { ComputedReligiousDay } from './religiousDaysModel';

export interface ReligiousDaysResult {
  allDays: ComputedReligiousDay[];
  nextUpcoming: ComputedReligiousDay | null;
  daysRemaining: number | null;
}

export function useReligiousDaysForYear(): ReligiousDaysResult {
  return useMemo(() => {
    const now = new Date();
    const today = startOfLocalDay(now);
    
    // Use fixed 2026 data (already sorted chronologically)
    const allDays = RELIGIOUS_DAYS_2026;
    
    // Find next upcoming event (date >= today)
    const nextUpcoming = allDays.find(day => {
      const dayStart = startOfLocalDay(day.date);
      return dayStart >= today;
    }) || null;
    
    // Calculate days remaining
    const daysRemaining = nextUpcoming 
      ? daysBetweenLocalDays(today, nextUpcoming.date)
      : null;
    
    return {
      allDays,
      nextUpcoming,
      daysRemaining
    };
  }, []); // Recompute only when component mounts (stable within same day)
}
