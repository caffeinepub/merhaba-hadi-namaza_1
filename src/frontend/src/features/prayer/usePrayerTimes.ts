import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes, PrayerTimes } from './aladhanApi';
import { useActor } from '../../hooks/useActor';
import type { Location } from '../location/types';

export function usePrayerTimes(location: Location | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PrayerTimes>({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location || !actor) {
        throw new Error('Location or actor not available');
      }
      return fetchPrayerTimes(location.latitude, location.longitude, actor);
    },
    enabled: !!location && !!actor && !actorFetching,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
