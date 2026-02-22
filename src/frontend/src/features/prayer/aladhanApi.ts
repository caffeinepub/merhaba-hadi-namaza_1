export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanResponse {
  data: {
    timings: AladhanTimings;
    date: {
      readable: string;
    };
  };
}

// Shared calculation method constant
export const ALADHAN_METHOD = 13;

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  actor: any
): Promise<PrayerTimes> {
  if (!actor) {
    throw new Error('Backend actor not available');
  }

  const today = new Date();
  const timestamp = Math.floor(today.getTime() / 1000).toString();

  try {
    // Call backend proxy instead of direct API call
    const jsonString = await actor.fetchPrayerTimes(
      latitude.toString(),
      longitude.toString(),
      timestamp,
      ALADHAN_METHOD.toString()
    );

    // Parse the JSON response from backend
    const data: AladhanResponse = JSON.parse(jsonString);

    if (!data || !data.data || !data.data.timings) {
      throw new Error('Invalid response from prayer times API');
    }

    return {
      fajr: data.data.timings.Fajr,
      sunrise: data.data.timings.Sunrise,
      dhuhr: data.data.timings.Dhuhr,
      asr: data.data.timings.Asr,
      maghrib: data.data.timings.Maghrib,
      isha: data.data.timings.Isha,
      date: data.data.date.readable,
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw new Error('Namaz vakitleri alınamadı. Lütfen tekrar deneyin.');
  }
}
