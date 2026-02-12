import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { LocationSetupSection } from '../location/LocationSetupSection';
import { NextPrayerCountdown } from './NextPrayerCountdown';
import { PrayerTimeCardsSection } from './PrayerTimeCardsSection';
import { useAppSettings } from '../settings/useAppSettings';
import { usePrayerTimes } from '../prayer/usePrayerTimes';
import { useWeather } from '../weather/useWeather';
import { applyOffsetToPrayerTimes } from '../prayer/timeOffset';
import { computeKerahatWindows, mergeTimesWithKerahat } from '../prayer/kerahatTimes';
import { MapPin, Sunrise, Sun, Sunset, Moon, Cloud, AlertCircle } from 'lucide-react';

export function HomeTab() {
  const { settings } = useAppSettings();
  const { data: prayerTimes, isLoading: prayerLoading, error: prayerError } = usePrayerTimes(settings.location);
  const { data: weather } = useWeather(settings.location);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const adjustedTimes = prayerTimes
    ? applyOffsetToPrayerTimes(prayerTimes, settings.offsetMinutes)
    : null;

  const prayerList = adjustedTimes
    ? [
        { name: 'İmsak', time: adjustedTimes.fajr, icon: Moon },
        { name: 'Güneş', time: adjustedTimes.sunrise, icon: Sunrise },
        { name: 'Öğle', time: adjustedTimes.dhuhr, icon: Sun },
        { name: 'İkindi', time: adjustedTimes.asr, icon: Sun },
        { name: 'Akşam', time: adjustedTimes.maghrib, icon: Sunset },
        { name: 'Yatsı', time: adjustedTimes.isha, icon: Moon }
      ]
    : [];

  // Compute kerahat windows and merge with prayer times
  const kerahatWindows = adjustedTimes ? computeKerahatWindows(adjustedTimes) : [];
  const mergedTimesList = adjustedTimes ? mergeTimesWithKerahat(prayerList, kerahatWindows) : [];

  // If no location is set, show location setup
  if (!settings.location) {
    return (
      <div className="space-y-4">
        <Card className="bg-accent/10 border-accent">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              Başlamak için lütfen konumunuzu seçin
            </p>
          </CardContent>
        </Card>
        <LocationSetupSection />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top summary row: Location button only (weather moved to header) */}
      <div className="flex flex-wrap items-center gap-3">
        <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{settings.location.displayName}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Konum Seç</DialogTitle>
            </DialogHeader>
            <LocationSetupSection />
          </DialogContent>
        </Dialog>
      </div>

      {/* Next prayer countdown */}
      <NextPrayerCountdown
        adjustedTimes={adjustedTimes}
        isLoading={prayerLoading}
        error={prayerError}
      />

      {/* Prayer times list with kerahat windows */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {prayerLoading && (
            <p className="text-sm text-muted-foreground text-center">Namaz vakitleri yükleniyor...</p>
          )}

          {prayerError && (
            <p className="text-sm text-destructive text-center">Namaz vakitleri alınamadı</p>
          )}

          {mergedTimesList.map((item, index) => {
            if (item.isKerahat) {
              return (
                <div
                  key={`kerahat-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-destructive">{item.timeRange}</span>
                </div>
              );
            } else {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-lg font-semibold tabular-nums">{item.time}</span>
                </div>
              );
            }
          })}
        </CardContent>
      </Card>

      {/* Prayer time cards section */}
      <PrayerTimeCardsSection
        adjustedTimes={adjustedTimes}
        isLoading={prayerLoading}
        error={prayerError}
      />

      {/* Weather details */}
      {weather && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center py-2">
              <p className="text-4xl font-bold">{Math.round(weather.temperature)}°C</p>
              <p className="text-base text-muted-foreground mt-1">
                {weather.weatherCode === 0 ? 'Açık' : weather.weatherCode <= 3 ? 'Parçalı Bulutlu' : weather.weatherCode <= 48 ? 'Sisli' : weather.weatherCode <= 67 ? 'Yağmurlu' : weather.weatherCode <= 77 ? 'Karlı' : weather.weatherCode <= 82 ? 'Sağanak Yağışlı' : weather.weatherCode <= 86 ? 'Kar Yağışlı' : 'Fırtınalı'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Cloud className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Rüzgar</p>
                  <p className="font-semibold">{Math.round(weather.windSpeed)} km/s</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Cloud className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nem</p>
                  <p className="font-semibold">{weather.humidity}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
