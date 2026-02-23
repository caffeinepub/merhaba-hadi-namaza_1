import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyPrayerTimes } from './aladhanWeeklyApi';
import type { Location } from '../location/types';

export function useWeeklyPrayerTimes(location: Location | null) {
  return useQuery({
    queryKey: ['weeklyPrayerTimes', location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) throw new Error('Location not selected');
      return fetchWeeklyPrayerTimes(location.latitude, location.longitude);
    },
    enabled: !!location,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1
  });
}
