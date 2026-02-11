import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadLocalSettings, saveLocalSettings } from './localSettingsStorage';
import { type AppSettingsModel } from './appSettingsModel';

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
  zikirmatikTarget: 33
};

export function useAppSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<AppSettingsModel>({
    queryKey: ['appSettings'],
    queryFn: async () => {
      return loadLocalSettings();
    },
    staleTime: Infinity
  });

  const mutation = useMutation({
    mutationFn: async (settings: AppSettingsModel) => {
      saveLocalSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    }
  });

  return {
    settings: query.data || DEFAULT_SETTINGS,
    isLoading: query.isLoading,
    saveSettings: mutation.mutateAsync,
    isSaving: mutation.isPending
  };
}
