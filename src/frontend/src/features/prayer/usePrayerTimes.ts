import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from './aladhanApi';
import type { Location } from '../location/types';

export function usePrayerTimes(location: Location | null) {
  return useQuery({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) throw new Error('Konum seçilmedi');
      return fetchPrayerTimes(location.latitude, location.longitude);
    },
    enabled: !!location,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2
  });
}
