import { useQuery } from '@tanstack/react-query';
import { searchLocation } from './openMeteoGeocoding';
import type { GeocodingResult } from './types';

export function useGeocodingSearch(searchText: string) {
  return useQuery<GeocodingResult[]>({
    queryKey: ['geocoding', searchText],
    queryFn: () => searchLocation(searchText),
    enabled: searchText.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}
