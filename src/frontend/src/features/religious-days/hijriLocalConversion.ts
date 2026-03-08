// Local Hijri-to-Gregorian computation without external APIs

import type { ComputedReligiousDay, HijriEvent } from "./religiousDaysModel";

/**
 * Converts Hijri events to Gregorian dates for a given year using browser's Intl API
 */
export function computeReligiousDaysForYear(
  events: HijriEvent[],
  gregorianYear: number,
): ComputedReligiousDay[] {
  const results: ComputedReligiousDay[] = [];

  // Scan through the entire year to find matching Hijri dates
  const startDate = new Date(gregorianYear, 0, 1);
  const endDate = new Date(gregorianYear, 11, 31);

  const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  });

  const gregorianFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // Create a map for quick event lookup
  const eventMap = new Map<string, HijriEvent>();
  for (const event of events) {
    const key = `${event.hijriMonth}-${event.hijriDay}`;
    eventMap.set(key, event);
  }

  // Scan each day of the year
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    try {
      const hijriParts = hijriFormatter.formatToParts(currentDate);
      const hijriMonth = Number.parseInt(
        hijriParts.find((p) => p.type === "month")?.value || "0",
      );
      const hijriDay = Number.parseInt(
        hijriParts.find((p) => p.type === "day")?.value || "0",
      );

      const key = `${hijriMonth}-${hijriDay}`;
      const event = eventMap.get(key);

      if (event) {
        results.push({
          id: event.id,
          name: event.name,
          date: new Date(currentDate),
          displayDate: gregorianFormatter.format(currentDate),
          hijriMonth,
          hijriDay,
        });
      }
    } catch (_error) {
      // Skip dates that can't be converted
    }

    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return results;
}
