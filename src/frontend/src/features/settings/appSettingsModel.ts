import type { Location } from '../location/types';
import type { NotificationLeadTimes } from './localSettingsStorage';

export type RamadanDayStatus = 'Fasted' | 'Missed';

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerDailyChecklist {
  [prayer: string]: boolean;
}

export interface PrayerKazaCounters {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface AppSettingsModel {
  location: Location | null;
  offsetMinutes: number;
  notificationLeadTimes: NotificationLeadTimes;
  zikirmatikCount?: number;
  zikirmatikTarget?: number;
  hatimLastReadPage?: number;
  adhkarMorningCompleted?: Record<string, boolean>;
  adhkarEveningCompleted?: Record<string, boolean>;
  fastingVoluntaryDates?: string[];
  fastingMakeUpDates?: string[];
  fastingMakeUpTargetCount?: number;
  ramadanDayStatuses?: RamadanDayStatus[];
  prayerDailyChecklists?: Record<string, PrayerDailyChecklist>;
  prayerKazaCounters?: PrayerKazaCounters;
  quranLastSurahNumber?: number;
  quranLastAyahNumber?: number;
  quranScrollPosition?: number;
}
