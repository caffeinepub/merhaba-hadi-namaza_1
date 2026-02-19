import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { MapPin, Info } from 'lucide-react';
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
import { DEFAULT_LOCATION } from '../location/types';

export function HomeTab() {
  const { settings } = useAppSettings();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  // Use default location if user hasn't set one
  const effectiveLocation = settings.location || DEFAULT_LOCATION;
  const isUsingDefaultLocation = !settings.location;

  const { data: prayerTimes, isLoading: prayerLoading, error: prayerError } = usePrayerTimes(effectiveLocation);
  const { data: weather } = useWeather(effectiveLocation);
  const { data: weeklyPrayerTimes, isLoading: weeklyLoading, error: weeklyError } = useWeeklyPrayerTimes(effectiveLocation);

  const adjustedTimes = prayerTimes
    ? applyOffsetToPrayerTimes(prayerTimes, settings.offsetMinutes)
    : null;

  const adjustedWeeklyTimes = weeklyPrayerTimes
    ? applyOffsetToWeeklyPrayerTimes(weeklyPrayerTimes, settings.offsetMinutes)
    : [];

  const { nextPrayer, nextPrayerMillis, timeRemaining } = useNextPrayerCountdown(adjustedTimes);

  const cityName = effectiveLocation.displayName;

  useAndroidWidgetUpdates(adjustedTimes, adjustedWeeklyTimes, cityName);
  useAndroidPushPrayerTimes(
    adjustedTimes,
    adjustedWeeklyTimes,
    nextPrayer?.name ?? null,
    nextPrayerMillis,
    timeRemaining || null
  );

  const handleLocationSelected = () => {
    setLocationDialogOpen(false);
  };

  const handleNavigateToLocation = () => {
    setLocationDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {isUsingDefaultLocation && (
        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Varsayılan konum kullanılıyor: <strong>{DEFAULT_LOCATION.displayName}</strong>
            <br />
            Daha doğru namaz vakitleri için kendi konumunuzu seçin.
          </AlertDescription>
        </Alert>
      )}

      <MotifFrame>
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Konum
              </CardTitle>
              <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 text-sm sm:text-base">
                    {isUsingDefaultLocation ? 'Seç' : 'Değiştir'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Konum Seçimi</DialogTitle>
                  </DialogHeader>
                  <LocationSetupSection onLocationSelected={handleLocationSelected} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-medium">
              {effectiveLocation.displayName}
            </p>
            {isUsingDefaultLocation && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Varsayılan konum - Kendi konumunuzu seçmek için "Seç" butonuna tıklayın
              </p>
            )}
          </CardContent>
        </Card>
      </MotifFrame>

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
    </div>
  );
}
