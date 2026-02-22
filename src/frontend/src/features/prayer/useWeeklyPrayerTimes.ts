import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyPrayerTimes, DailyPrayerTimes } from './aladhanWeeklyApi';
import { useActor } from '../../hooks/useActor';
import type { Location } from '../location/types';

export function useWeeklyPrayerTimes(location: Location | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyPrayerTimes[]>({
    queryKey: ['weeklyPrayerTimes', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location || !actor) {
        throw new Error('Location or actor not available');
      }
      return fetchWeeklyPrayerTimes(location.latitude, location.longitude, actor);
    },
    enabled: !!location && !!actor && !actorFetching,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
