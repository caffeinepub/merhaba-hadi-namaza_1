import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppSettingsModel } from "./appSettingsModel";
import {
  type LocalSettings,
  loadLocalSettings,
  saveLocalSettings,
} from "./localSettingsStorage";

const DEFAULT_SETTINGS: AppSettingsModel = {
  location: null,
  offsetMinutes: 0,
  notificationLeadTimes: {
    fajr: 15,
    sunrise: 15,
    dhuhr: 15,
    asr: 15,
    maghrib: 15,
    isha: 15,
  },
  zikirmatikCount: 0,
  zikirmatikTarget: 33,
  hatimLastReadPage: 1,
  adhkarMorningCompleted: {},
  adhkarEveningCompleted: {},
  fastingVoluntaryDates: [],
  fastingMakeUpDates: [],
  fastingMakeUpTargetCount: 0,
  ramadanDayStatuses: Array(30).fill("Fasted"),
  prayerDailyChecklists: {},
  prayerKazaCounters: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  quranLastSurahNumber: 1,
  quranLastAyahNumber: 1,
  quranScrollPosition: 0,
};

export function useAppSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<AppSettingsModel>({
    queryKey: ["appSettings"],
    queryFn: async () => {
      try {
        const settings = await loadLocalSettings();
        return { ...DEFAULT_SETTINGS, ...settings };
      } catch (error) {
        console.error("[useAppSettings] Failed to load settings:", error);
        return DEFAULT_SETTINGS;
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<AppSettingsModel>) => {
      try {
        const currentSettings = query.data || DEFAULT_SETTINGS;
        const newSettings: LocalSettings = { ...currentSettings, ...updates };
        await saveLocalSettings(newSettings);
        return newSettings;
      } catch (error) {
        console.error("[useAppSettings] Failed to save settings:", error);
        // Still return the merged settings so UI can update even if storage fails
        const currentSettings = query.data || DEFAULT_SETTINGS;
        return { ...currentSettings, ...updates } as LocalSettings;
      }
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(["appSettings"], {
        ...DEFAULT_SETTINGS,
        ...newSettings,
      });
    },
    onError: (error) => {
      console.error("[useAppSettings] Mutation error:", error);
    },
  });

  // Always return a valid settings object, never undefined
  const settingsData = query.data || DEFAULT_SETTINGS;

  return {
    // New API with awaitable save
    data: settingsData,
    isLoading: query.isLoading,
    updateSettings: async (updates: Partial<AppSettingsModel>) => {
      try {
        return await mutation.mutateAsync(updates);
      } catch (error) {
        console.error(
          "[useAppSettings] updateSettings error (suppressed):",
          error,
        );
        return { ...settingsData, ...updates } as LocalSettings;
      }
    },
    isUpdating: mutation.isPending,
    // Legacy API for backward compatibility - now also awaitable
    settings: settingsData,
    saveSettings: async (updates: Partial<AppSettingsModel>) => {
      try {
        return await mutation.mutateAsync(updates);
      } catch (error) {
        console.error(
          "[useAppSettings] saveSettings error (suppressed):",
          error,
        );
        return { ...settingsData, ...updates } as LocalSettings;
      }
    },
    isSaving: mutation.isPending,
  };
}
