import { useQuery } from '@tanstack/react-query';
import { fetchNearbyMosques } from './nearbyMosquesApi';
import type { NearbyMosque } from './types';

interface UseNearbyMosquesParams {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
}

export function useNearbyMosques({ latitude, longitude, radiusKm }: UseNearbyMosquesParams) {
  return useQuery<NearbyMosque[]>({
    queryKey: ['nearbyMosques', latitude, longitude, radiusKm],
    queryFn: async () => {
      if (latitude === null || longitude === null) {
        return [];
      }
      const radiusMeters = radiusKm * 1000;
      return fetchNearbyMosques(latitude, longitude, radiusMeters);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
