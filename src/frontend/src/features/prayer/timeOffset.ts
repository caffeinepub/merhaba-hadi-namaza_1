export function applyOffsetToTime(time: string, offsetMinutes: number): string {
  if (!time || offsetMinutes === 0) return time;

  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  
  const newHours = Math.floor((totalMinutes + 1440) % 1440 / 60);
  const newMinutes = Math.floor((totalMinutes + 1440) % 1440 % 60);
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

export function applyOffsetToPrayerTimes(times: any, offsetMinutes: number) {
  return {
    ...times,
    fajr: applyOffsetToTime(times.fajr, offsetMinutes),
    sunrise: applyOffsetToTime(times.sunrise, offsetMinutes),
    dhuhr: applyOffsetToTime(times.dhuhr, offsetMinutes),
    asr: applyOffsetToTime(times.asr, offsetMinutes),
    maghrib: applyOffsetToTime(times.maghrib, offsetMinutes),
    isha: applyOffsetToTime(times.isha, offsetMinutes)
  };
}

export function applyOffsetToWeeklyPrayerTimes(weeklyTimes: any[], offsetMinutes: number) {
  return weeklyTimes.map(dayTimes => applyOffsetToPrayerTimes(dayTimes, offsetMinutes));
}
