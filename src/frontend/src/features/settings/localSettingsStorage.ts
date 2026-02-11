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
}

const STORAGE_KEY = 'merhaba-hadi-namaza-settings';
const STORAGE_VERSION = 3;

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
        zikirmatikTarget: 33
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
        zikirmatikTarget: 33
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
        zikirmatikTarget: 33
      };
    }

    if (data.version !== STORAGE_VERSION) {
      return {
        location: null,
        offsetMinutes: 0,
        notificationLeadTimes: DEFAULT_NOTIFICATION_LEAD_TIMES,
        zikirmatikCount: 0,
        zikirmatikTarget: 33
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
      zikirmatikTarget: data.settings.zikirmatikTarget ?? 33
    };
  } catch (error) {
    console.error('Failed to load local settings:', error);
    return {
      location: null,
      offsetMinutes: 0,
      notificationLeadTimes: DEFAULT_NOTIFICATION_LEAD_TIMES,
      zikirmatikCount: 0,
      zikirmatikTarget: 33
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
    console.error('Failed to save local settings:', error);
  }
}
