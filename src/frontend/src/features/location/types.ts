export interface Location {
  displayName: string;
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

/**
 * Default fallback location (Istanbul, Turkey)
 * Used when all storage mechanisms fail and no location has been set
 */
export const DEFAULT_LOCATION: Location = {
  displayName: 'İstanbul, Türkiye (Varsayılan)',
  latitude: 41.0082,
  longitude: 28.9784
};
