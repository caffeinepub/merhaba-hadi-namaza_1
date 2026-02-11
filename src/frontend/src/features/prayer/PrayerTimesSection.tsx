import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { SelectLocationPrompt } from '../../components/SelectLocationPrompt';
import { usePrayerTimes } from './usePrayerTimes';
import { useAppSettings } from '../settings/useAppSettings';
import { applyOffsetToPrayerTimes } from './timeOffset';
import { Clock, Settings, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

interface PrayerTimesDisplayProps {
  onNavigateToLocation: () => void;
}

export function PrayerTimesSection({ onNavigateToLocation }: PrayerTimesDisplayProps) {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const { data: prayerTimes, isLoading, error } = usePrayerTimes(settings.location);
  const [offsetInput, setOffsetInput] = useState(settings.offsetMinutes.toString());
  const [isEditingOffset, setIsEditingOffset] = useState(false);

  if (!settings.location) {
    return <SelectLocationPrompt onNavigateToLocation={onNavigateToLocation} />;
  }

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Namaz Vakitleri
          </CardTitle>
          <CardDescription>{settings.location.displayName}</CardDescription>
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
              {prayerList.map((prayer) => {
                const Icon = prayer.icon;
                return (
                  <div
                    key={prayer.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{prayer.name}</span>
                    </div>
                    <span className="text-lg font-semibold tabular-nums">{prayer.time}</span>
                  </div>
                );
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
