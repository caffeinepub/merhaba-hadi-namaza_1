import { useQuery } from "@tanstack/react-query";
import { searchLocation } from "./openMeteoGeocoding";
import type { GeocodingResult } from "./types";

export function useGeocodingSearch(searchText: string) {
  const trimmed = searchText.trim();
  const isEnabled = trimmed.length >= 2;

  return useQuery<GeocodingResult[]>({
    queryKey: ["geocoding", trimmed],
    queryFn: async () => {
      try {
        return await searchLocation(trimmed);
      } catch (error) {
        console.error("[useGeocodingSearch] Search failed:", error);
        return [];
      }
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Return empty array as placeholder when disabled
    placeholderData: [],
  });
}
