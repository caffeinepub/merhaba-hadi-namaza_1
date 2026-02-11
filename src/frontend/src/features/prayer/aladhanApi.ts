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

export async function fetchPrayerTimes(latitude: number, longitude: number): Promise<PrayerTimes> {
  const today = new Date();
  const timestamp = Math.floor(today.getTime() / 1000);
  
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=13`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Namaz vakitleri alınamadı');
  }

  const data: AladhanResponse = await response.json();
  
  return {
    fajr: data.data.timings.Fajr,
    sunrise: data.data.timings.Sunrise,
    dhuhr: data.data.timings.Dhuhr,
    asr: data.data.timings.Asr,
    maghrib: data.data.timings.Maghrib,
    isha: data.data.timings.Isha,
    date: data.data.date.readable
  };
}
