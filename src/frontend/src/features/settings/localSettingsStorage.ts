import type { Location } from '../location/types';

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
  ramadanCompletedDays?: boolean[];
}

const STORAGE_KEY = 'merhaba-hadi-namaza-settings';
const STORAGE_VERSION = 7;

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

export function loadLocalSettings(): LocalSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
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
        ramadanCompletedDays: Array(30).fill(false)
      };
    }

    const data: StoredData = JSON.parse(stored);
    
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
        ramadanCompletedDays: Array(30).fill(false)
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
        ramadanCompletedDays: Array(30).fill(false)
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
        ramadanCompletedDays: Array(30).fill(false)
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
        ramadanCompletedDays: Array(30).fill(false)
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
        ramadanCompletedDays: Array(30).fill(false)
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
        ramadanCompletedDays: Array(30).fill(false)
      };
    }

    if (data.version !== STORAGE_VERSION) {
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
        ramadanCompletedDays: Array(30).fill(false)
      };
    }

    // Ensure all fields exist with defaults
    const notificationLeadTimes = {
      ...DEFAULT_NOTIFICATION_LEAD_TIMES,
      ...(data.settings.notificationLeadTimes || {})
    };

    return {
      ...data.settings,
      notificationLeadTimes,
      zikirmatikCount: data.settings.zikirmatikCount ?? 0,
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33,
      hatimLastReadPage: data.settings.hatimLastReadPage ?? 1,
      adhkarMorningCompleted: data.settings.adhkarMorningCompleted ?? {},
      adhkarEveningCompleted: data.settings.adhkarEveningCompleted ?? {},
      fastingVoluntaryDates: data.settings.fastingVoluntaryDates ?? [],
      fastingMakeUpDates: data.settings.fastingMakeUpDates ?? [],
      fastingMakeUpTargetCount: data.settings.fastingMakeUpTargetCount ?? 0,
      ramadanCompletedDays: data.settings.ramadanCompletedDays ?? Array(30).fill(false)
    };
  } catch (error) {
    console.error('Error loading settings:', error);
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
      ramadanCompletedDays: Array(30).fill(false)
    };
  }
}

export function saveLocalSettings(settings: LocalSettings): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      settings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
