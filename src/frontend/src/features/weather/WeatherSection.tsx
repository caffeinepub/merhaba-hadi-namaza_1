import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useWeather } from './useWeather';
import { useAppSettings } from '../settings/useAppSettings';
import { getWeatherDescription } from './openMeteoWeatherApi';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { DEFAULT_LOCATION } from '../location/types';

interface WeatherSectionProps {
  onNavigateToLocation: () => void;
}

export function WeatherSection({ onNavigateToLocation }: WeatherSectionProps) {
  const { settings } = useAppSettings();
  const effectiveLocation = settings.location || DEFAULT_LOCATION;
  const { data: weather, isLoading, error } = useWeather(effectiveLocation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Hava Durumu
        </CardTitle>
        <CardDescription>{effectiveLocation.displayName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Hava durumu yükleniyor...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">Hava durumu alınamadı</p>
        )}

        {weather && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-5xl font-bold">{Math.round(weather.temperature)}°C</p>
              <p className="text-lg text-muted-foreground mt-2">
                {getWeatherDescription(weather.weatherCode)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Wind className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Rüzgar</p>
                  <p className="font-semibold">{Math.round(weather.windSpeed)} km/s</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Droplets className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nem</p>
                  <p className="font-semibold">{weather.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
