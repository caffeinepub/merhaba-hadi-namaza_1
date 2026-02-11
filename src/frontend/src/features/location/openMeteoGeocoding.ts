import type { GeocodingResult, Location } from './types';

interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
    admin2?: string;
  }>;
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=tr&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Konum araması başarısız oldu');
  }

  const data: OpenMeteoGeocodingResponse = await response.json();
  return data.results || [];
}

export function geocodingResultToLocation(result: GeocodingResult): Location {
  const parts = [result.name];
  if (result.admin2) parts.push(result.admin2);
  if (result.admin1) parts.push(result.admin1);
  if (result.country) parts.push(result.country);

  return {
    displayName: parts.join(', '),
    latitude: result.latitude,
    longitude: result.longitude
  };
}
