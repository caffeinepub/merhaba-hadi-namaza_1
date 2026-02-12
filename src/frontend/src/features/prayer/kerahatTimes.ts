import { applyOffsetToTime } from './timeOffset';

export interface KerahatWindow {
  name: string;
  startTime: string;
  endTime: string;
  startMinutes: number; // For sorting
}

/**
 * Parse HH:mm time string to total minutes since midnight
 */
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

/**
 * Add minutes to a time string (HH:mm format) with 24-hour wraparound
 */
function addMinutesToTime(time: string, minutesToAdd: number): string {
  const totalMinutes = parseTimeToMinutes(time);
  const newTotalMinutes = (totalMinutes + minutesToAdd + 1440) % 1440;
  const newHours = Math.floor(newTotalMinutes / 60);
  const newMinutes = newTotalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

/**
 * Compute the three kerahat time windows from adjusted prayer times
 * Returns empty array if required times are missing or invalid
 */
export function computeKerahatWindows(adjustedTimes: {
  sunrise?: string;
  dhuhr?: string;
  maghrib?: string;
}): KerahatWindow[] {
  const windows: KerahatWindow[] = [];

  try {
    // Window 1: Sunrise → Sunrise + 40 minutes
    if (adjustedTimes.sunrise) {
      const startTime = adjustedTimes.sunrise;
      const endTime = addMinutesToTime(startTime, 40);
      windows.push({
        name: 'Kerahat Vakti',
        startTime,
        endTime,
        startMinutes: parseTimeToMinutes(startTime)
      });
    }

    // Window 2: Dhuhr - 45 minutes → Dhuhr
    if (adjustedTimes.dhuhr) {
      const endTime = adjustedTimes.dhuhr;
      const startTime = addMinutesToTime(endTime, -45);
      windows.push({
        name: 'Kerahat Vakti',
        startTime,
        endTime,
        startMinutes: parseTimeToMinutes(startTime)
      });
    }

    // Window 3: Maghrib - 45 minutes → Maghrib
    if (adjustedTimes.maghrib) {
      const endTime = adjustedTimes.maghrib;
      const startTime = addMinutesToTime(endTime, -45);
      windows.push({
        name: 'Kerahat Vakti',
        startTime,
        endTime,
        startMinutes: parseTimeToMinutes(startTime)
      });
    }
  } catch (error) {
    console.error('Error computing kerahat windows:', error);
    return [];
  }

  return windows;
}

/**
 * Merge prayer times and kerahat windows into a single chronologically sorted list
 */
export interface TimeListItem {
  name: string;
  time?: string;
  timeRange?: string;
  icon?: any;
  startMinutes: number;
  isKerahat: boolean;
}

export function mergeTimesWithKerahat(
  prayerList: Array<{ name: string; time: string; icon: any }>,
  kerahatWindows: KerahatWindow[]
): TimeListItem[] {
  const prayerItems: TimeListItem[] = prayerList.map(prayer => ({
    name: prayer.name,
    time: prayer.time,
    icon: prayer.icon,
    startMinutes: parseTimeToMinutes(prayer.time),
    isKerahat: false
  }));

  const kerahatItems: TimeListItem[] = kerahatWindows.map(window => ({
    name: window.name,
    timeRange: `${window.startTime} - ${window.endTime}`,
    startMinutes: window.startMinutes,
    isKerahat: true
  }));

  const allItems = [...prayerItems, ...kerahatItems];
  allItems.sort((a, b) => a.startMinutes - b.startMinutes);

  return allItems;
}
