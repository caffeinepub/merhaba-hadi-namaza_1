import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from './openMeteoWeatherApi';
import type { Location } from '../location/types';

export function useWeather(location: Location | null) {
  return useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) throw new Error('Konum seçilmedi');
      return fetchWeather(location.latitude, location.longitude);
    },
    enabled: !!location,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
}
