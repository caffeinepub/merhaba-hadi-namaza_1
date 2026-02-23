import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { usePrayerTimes } from './usePrayerTimes';
import { useAppSettings } from '../settings/useAppSettings';
import { applyOffsetToPrayerTimes } from './timeOffset';
import { computeKerahatWindows, mergeTimesWithKerahat } from './kerahatTimes';
import { Clock, Sunrise, Sun, Sunset, Moon, AlertCircle } from 'lucide-react';
import { DEFAULT_LOCATION } from '../location/types';

interface PrayerTimesDisplayProps {
  onNavigateToLocation: () => void;
}

export function PrayerTimesSection({ onNavigateToLocation }: PrayerTimesDisplayProps) {
  const { settings } = useAppSettings();
  const effectiveLocation = settings.location || DEFAULT_LOCATION;
  const { data: prayerTimes, isLoading, error } = usePrayerTimes(effectiveLocation);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Namaz Vakitleri
        </CardTitle>
        <CardDescription>{effectiveLocation.displayName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Namaz vakitleri yükleniyor...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">Namaz vakitleri alınamadı</p>
        )}

        {adjustedTimes && (
          <div className="space-y-3">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
