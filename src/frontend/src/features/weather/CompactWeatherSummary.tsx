import React from 'react';
import { Cloud } from 'lucide-react';
import { useAppSettings } from '../settings/useAppSettings';
import { useWeather } from './useWeather';
import { getWeatherDescription } from './openMeteoWeatherApi';

export function CompactWeatherSummary() {
  const { settings } = useAppSettings();
  const { data: weather, isLoading } = useWeather(settings.location);

  // Don't render if no location is set
  if (!settings.location) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Cloud className="h-4 w-4 text-muted-foreground" />
      {isLoading && <span className="text-muted-foreground">Loading...</span>}
      {weather && (
        <span className="font-medium">
          {Math.round(weather.temperature)}°C · {getWeatherDescription(weather.weatherCode)}
        </span>
      )}
    </div>
  );
}
