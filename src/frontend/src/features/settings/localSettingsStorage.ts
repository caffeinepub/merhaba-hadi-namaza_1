import type { Location } from '../location/types';
import { DEFAULT_LOCATION } from '../location/types';
import type { RamadanDayStatus, PrayerDailyChecklist, PrayerKazaCounters } from './appSettingsModel';
import { getDurableLocation, setDurableLocation } from './durableLocationStorage';

export interface NotificationLeadTimes {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface LocalSettings {
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

const STORAGE_KEY = 'merhaba-hadi-namaza-settings';
const MANUAL_LOCATION_KEY = 'prayer-times-manual-location';
const STORAGE_VERSION = 10;

interface StoredData {
  version: number;
  settings: LocalSettings;
}

const DEFAULT_NOTIFICATION_LEAD_TIMES: NotificationLeadTimes = {
  fajr: 15,
  sunrise: 15,
  dhuhr: 15,
  asr: 15,
  maghrib: 15,
  isha: 15
};

const DEFAULT_PRAYER_KAZA_COUNTERS: PrayerKazaCounters = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0
};

/**
 * Save manual location to localStorage for mobile persistence
 */
export function saveManualLocationToLocalStorage(location: Location): void {
  try {
    const locationData = JSON.stringify(location);
    localStorage.setItem(MANUAL_LOCATION_KEY, locationData);
    console.log('[LocalStorage] Saved manual location:', location.displayName);
  } catch (error) {
    console.warn('Failed to save manual location to localStorage:', error);
  }
}

/**
 * Get manual location from localStorage
 */
export function getManualLocationFromLocalStorage(): Location | null {
  try {
    const stored = localStorage.getItem(MANUAL_LOCATION_KEY);
    if (!stored) return null;

    const location = JSON.parse(stored) as Location;
    
    // Validate required fields
    if (
      !location ||
      typeof location.displayName !== 'string' ||
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number'
    ) {
      console.warn('Invalid manual location data in localStorage');
      return null;
    }

    console.log('[LocalStorage] Loaded manual location:', location.displayName);
    return location;
  } catch (error) {
    console.warn('Failed to load manual location from localStorage:', error);
    return null;
  }
}

export async function loadLocalSettings(): Promise<LocalSettings> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let settings: LocalSettings;

    if (!stored) {
      settings = {
        location: null,
        offsetMinutes: 0,
        notificationLeadTimes: DEFAULT_NOTIFICATION_LEAD_TIMES,
        zikirmatikCount: 0,
        zikirmatikTarget: 33,
        hatimLastReadPage: 1,
        adhkarMorningCompleted: {},
        adhkarEveningCompleted: {},
        fastingVoluntaryDates: [],
        fastingMakeUpDates: [],
        fastingMakeUpTargetCount: 0,
        ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
        prayerDailyChecklists: {},
        prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
        quranLastSurahNumber: 1,
        quranLastAyahNumber: 1,
        quranScrollPosition: 0
      };
    } else {
      const data: StoredData = JSON.parse(stored);
      settings = migrateSettings(data);
    }

    // Multi-layer recovery strategy for location
    if (!settings.location) {
      console.log('[Settings] No location in main settings, attempting recovery...');

      // 1. Try manual location key in localStorage
      const manualLocation = getManualLocationFromLocalStorage();
      if (manualLocation) {
        console.log('[Settings] Recovered from manual localStorage key');
        settings.location = manualLocation;
        saveLocalSettingsSync(settings);
        await setDurableLocation(manualLocation);
        return settings;
      }

      // 2. Try durable storage (localStorage backup, sessionStorage, IndexedDB)
      const durableLocation = await getDurableLocation();
      if (durableLocation) {
        console.log('[Settings] Recovered from durable storage');
        settings.location = durableLocation;
        saveLocalSettingsSync(settings);
        saveManualLocationToLocalStorage(durableLocation);
        return settings;
      }

      // 3. No location found - will use default in App.tsx
      console.log('[Settings] No location found in any storage');
    } else {
      // Location exists in main settings - ensure it's backed up everywhere
      console.log('[Settings] Location found in main settings:', settings.location.displayName);
      const durableLocation = await getDurableLocation();
      if (!durableLocation) {
        console.log('[Settings] Backfilling durable storage');
        await setDurableLocation(settings.location);
        saveManualLocationToLocalStorage(settings.location);
      }
    }

    return settings;
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return {
      location: null,
      offsetMinutes: 0,
      notificationLeadTimes: DEFAULT_NOTIFICATION_LEAD_TIMES,
      zikirmatikCount: 0,
      zikirmatikTarget: 33,
      hatimLastReadPage: 1,
      adhkarMorningCompleted: {},
      adhkarEveningCompleted: {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }
}

function migrateSettings(data: StoredData): LocalSettings {
  // Handle migration from version 1 to version 2
  if (data.version === 1) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: DEFAULT_NOTIFICATION_LEAD_TIMES,
      zikirmatikCount: 0,
      zikirmatikTarget: 33,
      hatimLastReadPage: 1,
      adhkarMorningCompleted: {},
      adhkarEveningCompleted: {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 2 to version 3
  if (data.version === 2) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: 0,
      zikirmatikTarget: 33,
      hatimLastReadPage: 1,
      adhkarMorningCompleted: {},
      adhkarEveningCompleted: {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 3 to version 4
  if (data.version === 3) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: 1,
      adhkarMorningCompleted: {},
      adhkarEveningCompleted: {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 4 to version 5
  if (data.version === 4) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: {},
      adhkarEveningCompleted: {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 5 to version 6
  if (data.version === 5) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: [],
      fastingMakeUpDates: [],
      fastingMakeUpTargetCount: 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 6 to version 7
  if (data.version === 6) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
      fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
      fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 7 to version 8
  if (data.version === 7) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
      fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
      fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
      ramadanDayStatuses: data.settings.ramadanDayStatuses ?? Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 8 to version 9
  if (data.version === 8) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
      fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
      fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
      ramadanDayStatuses: data.settings.ramadanDayStatuses ?? Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: data.settings.prayerDailyChecklists ?? {},
      prayerKazaCounters: DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Handle migration from version 9 to version 10
  if (data.version === 9) {
    return {
      location: data.settings.location || null,
      offsetMinutes: data.settings.offsetMinutes || 0,
      notificationLeadTimes: {
        ...DEFAULT_NOTIFICATION_LEAD_TIMES,
        ...(data.settings.notificationLeadTimes || {})
      },
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
      fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
      fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
      ramadanDayStatuses: data.settings.ramadanDayStatuses ?? Array(30).fill('Fasted' as RamadanDayStatus),
      prayerDailyChecklists: data.settings.prayerDailyChecklists ?? {},
      prayerKazaCounters: data.settings.prayerKazaCounters ?? DEFAULT_PRAYER_KAZA_COUNTERS,
      quranLastSurahNumber: 1,
      quranLastAyahNumber: 1,
      quranScrollPosition: 0
    };
  }

  // Version 10 - current version with Quran reading state
  return {
    location: data.settings.location || null,
    offsetMinutes: data.settings.offsetMinutes || 0,
    notificationLeadTimes: {
      ...DEFAULT_NOTIFICATION_LEAD_TIMES,
      ...(data.settings.notificationLeadTimes || {})
    },
    zikirmatikCount: data.settings.zikirmatikCount ?? 0,
    zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
    hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
    adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
    adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
    fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
    fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
    fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
    ramadanDayStatuses: data.settings.ramadanDayStatuses ?? Array(30).fill('Fasted' as RamadanDayStatus),
    prayerDailyChecklists: data.settings.prayerDailyChecklists ?? {},
    prayerKazaCounters: data.settings.prayerKazaCounters ?? DEFAULT_PRAYER_KAZA_COUNTERS,
    quranLastSurahNumber: data.settings.quranLastSurahNumber ?? 1,
    quranLastAyahNumber: data.settings.quranLastAyahNumber ?? 1,
    quranScrollPosition: data.settings.quranScrollPosition ?? 0
  };
}

export function saveLocalSettingsSync(settings: LocalSettings): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      settings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

export async function saveLocalSettings(settings: LocalSettings): Promise<void> {
  saveLocalSettingsSync(settings);
  
  // Also save location to durable storage if present
  if (settings.location) {
    try {
      await setDurableLocation(settings.location);
      saveManualLocationToLocalStorage(settings.location);
    } catch (error) {
      console.error('Failed to save location to durable storage:', error);
    }
  }
}
