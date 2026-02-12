import type { NearbyMosque } from './types';
import { calculateDistance } from './distance';

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    'name:tr'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * Fetch nearby mosques from Overpass API (OpenStreetMap)
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @param radiusMeters Search radius in meters
 * @returns Array of nearby mosques with computed distances
 */
export async function fetchNearbyMosques(
  latitude: number,
  longitude: number,
  radiusMeters: number
): Promise<NearbyMosque[]> {
  // Overpass QL query to find mosques (place_of_worship with religion=muslim)
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
    );
    out center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data: OverpassResponse = await response.json();

  // Map and filter results
  const mosques: NearbyMosque[] = [];

  for (const element of data.elements) {
    // Get coordinates (nodes have lat/lon directly, ways have center)
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;

    // Skip if no coordinates
    if (lat === undefined || lon === undefined) {
      continue;
    }

    // Get name (prefer Turkish name if available)
    const name = element.tags?.['name:tr'] || element.tags?.name;

    // Skip if no name
    if (!name) {
      continue;
    }

    // Build address if available
    let address: string | undefined;
    if (element.tags) {
      const parts: string[] = [];
      if (element.tags['addr:street']) {
        parts.push(element.tags['addr:street']);
        if (element.tags['addr:housenumber']) {
          parts[parts.length - 1] = `${element.tags['addr:street']} ${element.tags['addr:housenumber']}`;
        }
      }
      if (element.tags['addr:city']) {
        parts.push(element.tags['addr:city']);
      }
      if (parts.length > 0) {
        address = parts.join(', ');
      }
    }

    // Calculate distance
    const distanceMeters = calculateDistance(latitude, longitude, lat, lon);

    mosques.push({
      id: `${element.type}-${element.id}`,
      name,
      latitude: lat,
      longitude: lon,
      distanceMeters,
      address,
    });
  }

  // Sort by distance
  mosques.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return mosques;
}
