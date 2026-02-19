import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { usePrayerTimes } from './usePrayerTimes';
import { useAppSettings } from '../settings/useAppSettings';
import { applyOffsetToPrayerTimes } from './timeOffset';
import { computeKerahatWindows, mergeTimesWithKerahat } from './kerahatTimes';
import { Clock, Settings, Sunrise, Sun, Sunset, Moon, AlertCircle } from 'lucide-react';
import { DEFAULT_LOCATION } from '../location/types';

interface PrayerTimesDisplayProps {
  onNavigateToLocation: () => void;
}

export function PrayerTimesSection({ onNavigateToLocation }: PrayerTimesDisplayProps) {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const effectiveLocation = settings.location || DEFAULT_LOCATION;
  const { data: prayerTimes, isLoading, error } = usePrayerTimes(effectiveLocation);
  const [offsetInput, setOffsetInput] = useState(settings.offsetMinutes.toString());
  const [isEditingOffset, setIsEditingOffset] = useState(false);

  const handleSaveOffset = async () => {
    const newOffset = parseInt(offsetInput, 10) || 0;
    await saveSettings({
      ...settings,
      offsetMinutes: newOffset
    });
    setIsEditingOffset(false);
  };

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
    <div className="space-y-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Saat Düzeltmesi
          </CardTitle>
          <CardDescription>
            Diyanet'e göre dakika farkı (+ veya -)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offset">Dakika Farkı</Label>
            <div className="flex gap-2">
              <Input
                id="offset"
                type="number"
                value={offsetInput}
                onChange={(e) => setOffsetInput(e.target.value)}
                onFocus={() => setIsEditingOffset(true)}
                placeholder="0"
                className="max-w-[120px]"
              />
              {isEditingOffset && (
                <Button
                  onClick={handleSaveOffset}
                  disabled={isSaving}
                  size="sm"
                >
                  Kaydet
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Şu anki düzeltme: {settings.offsetMinutes > 0 ? '+' : ''}{settings.offsetMinutes} dakika
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
