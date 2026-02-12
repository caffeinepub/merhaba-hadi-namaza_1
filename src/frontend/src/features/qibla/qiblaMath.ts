// Kaaba coordinates in Mecca
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Calculate the initial bearing (forward azimuth) from a given point to the Kaaba
 * using the great-circle formula
 * 
 * @param latitude - Starting latitude in degrees
 * @param longitude - Starting longitude in degrees
 * @returns Bearing in degrees (0-360, where 0 is North)
 */
export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const lat1 = toRadians(latitude);
  const lng1 = toRadians(longitude);
  const lat2 = toRadians(KAABA_LAT);
  const lng2 = toRadians(KAABA_LNG);

  const dLng = lng2 - lng1;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = toDegrees(Math.atan2(y, x));

  return normalizeAngle(bearing);
}
