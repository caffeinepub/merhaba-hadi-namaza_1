import { ALADHAN_METHOD } from './aladhanApi';

export interface DailyPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  dayLabel: string;
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
}

interface AladhanResponse {
  data: {
    timings: AladhanTimings;
    date: {
      readable: string;
      gregorian: {
        date: string;
      };
    };
  };
}

export async function fetchWeeklyPrayerTimes(
  latitude: number,
  longitude: number,
  actor: any
): Promise<DailyPrayerTimes[]> {
  if (!actor) {
    throw new Error('Backend actor not available');
  }

  const weeklyData: DailyPrayerTimes[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const timestamp = Math.floor(targetDate.getTime() / 1000).toString();

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

      // Format day label (e.g., "Pazartesi, 13 Şubat")
      const dayLabel = targetDate.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      // Use Imsak for fajr if available, otherwise use Fajr
      const fajrTime = data.data.timings.Imsak || data.data.timings.Fajr;

      weeklyData.push({
        fajr: fajrTime,
        sunrise: data.data.timings.Sunrise,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
        date: data.data.date.readable,
        dayLabel,
      });
    } catch (error) {
      console.error(`Error fetching prayer times for day ${i}:`, error);
      throw new Error('Haftalık namaz vakitleri alınamadı. Lütfen tekrar deneyin.');
    }
  }

  return weeklyData;
}
