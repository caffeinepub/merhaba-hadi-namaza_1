export type PrayerSlot =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

export interface AdjustedPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Determines the current prayer slot based on adjusted prayer times.
 * Returns the slot identifier for the current time period.
 */
export function getCurrentPrayerSlot(
  adjustedTimes: AdjustedPrayerTimes,
): PrayerSlot {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Convert prayer times to minutes
  const times = {
    fajr: timeToMinutes(adjustedTimes.fajr),
    sunrise: timeToMinutes(adjustedTimes.sunrise),
    dhuhr: timeToMinutes(adjustedTimes.dhuhr),
    asr: timeToMinutes(adjustedTimes.asr),
    maghrib: timeToMinutes(adjustedTimes.maghrib),
    isha: timeToMinutes(adjustedTimes.isha),
  };

  // Determine current slot
  if (currentMinutes >= times.isha || currentMinutes < times.fajr) {
    return "isha";
  }
  if (currentMinutes >= times.maghrib) {
    return "maghrib";
  }
  if (currentMinutes >= times.asr) {
    return "asr";
  }
  if (currentMinutes >= times.dhuhr) {
    return "dhuhr";
  }
  if (currentMinutes >= times.sunrise) {
    return "sunrise";
  }
  return "fajr";
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
