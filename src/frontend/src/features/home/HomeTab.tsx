import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { MapPin } from 'lucide-react';
import { useAppSettings } from '../settings/useAppSettings';
import { usePrayerTimes } from '../prayer/usePrayerTimes';
import { useWeather } from '../weather/useWeather';
import { useWeeklyPrayerTimes } from '../prayer/useWeeklyPrayerTimes';
import { SelectLocationPrompt } from '../../components/SelectLocationPrompt';
import { LocationSetupSection } from '../location/LocationSetupSection';
import { PrayerTimesSection } from '../prayer/PrayerTimesSection';
import { WeatherSection } from '../weather/WeatherSection';
import { NextPrayerCountdown } from './NextPrayerCountdown';
import { useNextPrayerCountdown } from './useNextPrayerCountdown';
import { PrayerTimeCardsSection } from './PrayerTimeCardsSection';
import { MotifFrame } from './MotifFrame';
import { WeeklyPrayerTimesSection } from './WeeklyPrayerTimesSection';
import { useAndroidWidgetUpdates } from './useAndroidWidgetUpdates';
import { useAndroidPushPrayerTimes } from './useAndroidPushPrayerTimes';
import { SahurIftarStrip } from './SahurIftarStrip';
import { applyOffsetToPrayerTimes } from '../prayer/timeOffset';
import { applyOffsetToWeeklyPrayerTimes } from '../prayer/timeOffset';

export function HomeTab() {
  const { settings } = useAppSettings();
  const { data: prayerTimes, isLoading: prayerLoading, error: prayerError } = usePrayerTimes(settings.location);
  const { data: weather } = useWeather(settings.location);
  const { data: weeklyPrayerTimes, isLoading: weeklyLoading, error: weeklyError } = useWeeklyPrayerTimes(settings.location);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const adjustedTimes = prayerTimes
    ? applyOffsetToPrayerTimes(prayerTimes, settings.offsetMinutes)
    : null;

  const adjustedWeeklyTimes = weeklyPrayerTimes
    ? applyOffsetToWeeklyPrayerTimes(weeklyPrayerTimes, settings.offsetMinutes)
    : [];

  const { nextPrayer, nextPrayerMillis, timeRemaining } = useNextPrayerCountdown(adjustedTimes);

  const cityName = settings.location?.displayName;

  useAndroidWidgetUpdates(adjustedTimes, adjustedWeeklyTimes, cityName);
  useAndroidPushPrayerTimes(
    adjustedTimes,
    adjustedWeeklyTimes,
    nextPrayer?.name ?? null,
    nextPrayerMillis,
    timeRemaining || null
  );

  const hasLocation = !!settings.location;

  const handleLocationSelected = () => {
    setLocationDialogOpen(false);
  };

  const handleNavigateToLocation = () => {
    setLocationDialogOpen(true);
  };

  return (
    <div className="space-y-6 pb-6">
      <MotifFrame>
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Konum
              </CardTitle>
              <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    {hasLocation ? 'Değiştir' : 'Seç'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Konum Seçimi</DialogTitle>
                  </DialogHeader>
                  <LocationSetupSection onLocationSelected={handleLocationSelected} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {hasLocation ? (
              <p className="text-lg font-medium">{settings.location?.displayName}</p>
            ) : (
              <p className="text-muted-foreground">Konum seçilmedi</p>
            )}
          </CardContent>
        </Card>
      </MotifFrame>

      {hasLocation && (
        <>
          <SahurIftarStrip adjustedTimes={adjustedTimes} isLoading={prayerLoading} error={prayerError} />

          <MotifFrame>
            <NextPrayerCountdown nextPrayer={nextPrayer} timeRemaining={timeRemaining} isLoading={prayerLoading} error={prayerError} />
          </MotifFrame>

          <MotifFrame>
            <WeeklyPrayerTimesSection weeklyData={adjustedWeeklyTimes} isLoading={weeklyLoading} error={weeklyError} />
          </MotifFrame>

          <MotifFrame>
            <PrayerTimesSection onNavigateToLocation={handleNavigateToLocation} />
          </MotifFrame>

          <PrayerTimeCardsSection adjustedTimes={adjustedTimes} isLoading={prayerLoading} error={prayerError} />

          <MotifFrame>
            <WeatherSection onNavigateToLocation={handleNavigateToLocation} />
          </MotifFrame>
        </>
      )}

      {!hasLocation && (
        <MotifFrame>
          <SelectLocationPrompt onNavigateToLocation={handleNavigateToLocation} />
        </MotifFrame>
      )}
    </div>
  );
}
