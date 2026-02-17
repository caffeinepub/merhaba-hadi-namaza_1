import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadLocalSettings, saveLocalSettings, type LocalSettings } from './localSettingsStorage';
import type { AppSettingsModel } from './appSettingsModel';

const DEFAULT_SETTINGS: AppSettingsModel = {
  location: null,
  offsetMinutes: 0,
  notificationLeadTimes: {
    fajr: 15,
    sunrise: 15,
    dhuhr: 15,
    asr: 15,
    maghrib: 15,
    isha: 15
  },
  zikirmatikCount: 0,
  zikirmatikTarget: 33,
  hatimLastReadPage: 1,
  adhkarMorningCompleted: {},
  adhkarEveningCompleted: {},
  fastingVoluntaryDates: [],
  fastingMakeUpDates: [],
  fastingMakeUpTargetCount: 0,
  ramadanDayStatuses: Array(30).fill('Fasted'),
  prayerDailyChecklists: {},
  prayerKazaCounters: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  quranLastSurahNumber: 1,
  quranLastAyahNumber: 1,
  quranScrollPosition: 0
};

export function useAppSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<AppSettingsModel>({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const settings = await loadLocalSettings();
      return { ...DEFAULT_SETTINGS, ...settings };
    },
    staleTime: Infinity,
    gcTime: Infinity
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<AppSettingsModel>) => {
      const currentSettings = query.data || DEFAULT_SETTINGS;
      const newSettings: LocalSettings = { ...currentSettings, ...updates };
      await saveLocalSettings(newSettings);
      return newSettings;
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(['appSettings'], newSettings);
    }
  });

  // Always return a valid settings object, never undefined
  const settingsData = query.data || DEFAULT_SETTINGS;

  return {
    // New API with awaitable save
    data: settingsData,
    isLoading: query.isLoading,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    // Legacy API for backward compatibility - now also awaitable
    settings: settingsData,
    saveSettings: mutation.mutateAsync,
    isSaving: mutation.isPending
  };
}
