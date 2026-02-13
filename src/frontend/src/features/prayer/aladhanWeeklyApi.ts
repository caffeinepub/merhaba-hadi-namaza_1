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
  longitude: number
): Promise<DailyPrayerTimes[]> {
  const weeklyData: DailyPrayerTimes[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const timestamp = Math.floor(targetDate.getTime() / 1000);

    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${ALADHAN_METHOD}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times for the week');
      }

      const data: AladhanResponse = await response.json();

      // Format day label (e.g., "Pazartesi, 13 Şubat")
      const dayLabel = targetDate.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });

      weeklyData.push({
        fajr: data.data.timings.Fajr,
        sunrise: data.data.timings.Sunrise,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
        date: data.data.date.readable,
        dayLabel
      });
    } catch (error) {
      throw new Error('Failed to fetch prayer times for the week');
    }
  }

  return weeklyData;
}
