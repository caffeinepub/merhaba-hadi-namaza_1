import { useEffect } from 'react';
import { useAppSettings } from '../settings/useAppSettings';

export interface QuranReadingState {
  lastSurahNumber: number;
  lastAyahNumber: number;
  scrollPosition: number;
}

export function useQuranReadingState() {
  const { data: settings, updateSettings } = useAppSettings();

  const readingState: QuranReadingState = {
    lastSurahNumber: settings?.quranLastSurahNumber || 1,
    lastAyahNumber: settings?.quranLastAyahNumber || 1,
    scrollPosition: settings?.quranScrollPosition || 0
  };

  const saveReadingState = (state: Partial<QuranReadingState>) => {
    updateSettings({
      quranLastSurahNumber: state.lastSurahNumber ?? readingState.lastSurahNumber,
      quranLastAyahNumber: state.lastAyahNumber ?? readingState.lastAyahNumber,
      quranScrollPosition: state.scrollPosition ?? readingState.scrollPosition
    });
  };

  return {
    readingState,
    saveReadingState
  };
}
