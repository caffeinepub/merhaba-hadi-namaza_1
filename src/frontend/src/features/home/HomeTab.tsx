import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Info, MapPin } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Skeleton } from "../../components/ui/skeleton";
import { LocationSetupSection } from "../location/LocationSetupSection";
import { DEFAULT_LOCATION } from "../location/types";
import { PrayerTimesSection } from "../prayer/PrayerTimesSection";
import { applyOffsetToPrayerTimes } from "../prayer/timeOffset";
import { applyOffsetToWeeklyPrayerTimes } from "../prayer/timeOffset";
import { usePrayerTimes } from "../prayer/usePrayerTimes";
import { useWeeklyPrayerTimes } from "../prayer/useWeeklyPrayerTimes";
import { useAppSettings } from "../settings/useAppSettings";
import { WeatherSection } from "../weather/WeatherSection";
import { useWeather } from "../weather/useWeather";
import { MotifFrame } from "./MotifFrame";
import { NextPrayerCountdown } from "./NextPrayerCountdown";
import { PrayerTimeCardsSection } from "./PrayerTimeCardsSection";
import { SahurIftarStrip } from "./SahurIftarStrip";
import { WeeklyPrayerTimesSection } from "./WeeklyPrayerTimesSection";
import { useAndroidPushPrayerTimes } from "./useAndroidPushPrayerTimes";
import { useAndroidWidgetUpdates } from "./useAndroidWidgetUpdates";
import { useNextPrayerCountdown } from "./useNextPrayerCountdown";

function PrayerLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}

export function HomeTab() {
  const { settings } = useAppSettings();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Use default location if user hasn't set one
  const effectiveLocation = settings.location || DEFAULT_LOCATION;
  const isUsingDefaultLocation = !settings.location;

  const {
    data: prayerTimes,
    isLoading: prayerLoading,
    error: prayerError,
  } = usePrayerTimes(effectiveLocation);
  useWeather(effectiveLocation);
  const {
    data: weeklyPrayerTimes,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useWeeklyPrayerTimes(effectiveLocation);

  const adjustedTimes = prayerTimes
    ? applyOffsetToPrayerTimes(prayerTimes, settings.offsetMinutes)
    : null;

  const adjustedWeeklyTimes = weeklyPrayerTimes
    ? applyOffsetToWeeklyPrayerTimes(weeklyPrayerTimes, settings.offsetMinutes)
    : [];

  const { nextPrayer, nextPrayerMillis, timeRemaining } =
    useNextPrayerCountdown(adjustedTimes);

  const cityName = effectiveLocation.displayName;

  useAndroidWidgetUpdates(adjustedTimes, adjustedWeeklyTimes, cityName);
  useAndroidPushPrayerTimes(
    adjustedTimes,
    adjustedWeeklyTimes,
    nextPrayer?.name ?? null,
    nextPrayerMillis,
    timeRemaining || null,
  );

  const handleLocationSelected = () => {
    // Invalidate prayer time caches so they reload for the new location
    queryClient.invalidateQueries({ queryKey: ["prayerTimes"] });
    queryClient.invalidateQueries({ queryKey: ["weeklyPrayerTimes"] });
    setLocationDialogOpen(false);
  };

  const handleNavigateToLocation = () => {
    setLocationDialogOpen(true);
  };

  // Show loading skeleton while prayer times are being fetched and no data yet
  const showLoadingSkeleton = prayerLoading && !adjustedTimes;

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {isUsingDefaultLocation && (
        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Varsayılan konum kullanılıyor:{" "}
            <strong>{DEFAULT_LOCATION.displayName}</strong>
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
              <Dialog
                open={locationDialogOpen}
                onOpenChange={setLocationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 text-sm sm:text-base"
                    data-ocid="home.location.edit_button"
                  >
                    {isUsingDefaultLocation ? "Seç" : "Değiştir"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Konum Seçimi
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <LocationSetupSection
                      onLocationSelected={handleLocationSelected}
                    />
                  </div>
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
                Varsayılan konum - Kendi konumunuzu seçmek için "Seç" butonuna
                tıklayın
              </p>
            )}
          </CardContent>
        </Card>
      </MotifFrame>

      {/* Show loading skeleton while prayer data is loading */}
      {showLoadingSkeleton ? (
        <MotifFrame>
          <PrayerLoadingSkeleton />
        </MotifFrame>
      ) : (
        <>
          {prayerError && !adjustedTimes && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  Namaz vakitleri yüklenemedi
                </p>
                <p className="text-xs mt-0.5 opacity-80">
                  Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.
                </p>
              </div>
            </div>
          )}

          <SahurIftarStrip
            adjustedTimes={adjustedTimes}
            isLoading={prayerLoading}
            error={prayerError}
          />

          <MotifFrame>
            <NextPrayerCountdown
              nextPrayer={nextPrayer}
              timeRemaining={timeRemaining}
              isLoading={prayerLoading}
              error={prayerError}
            />
          </MotifFrame>

          <MotifFrame>
            <WeeklyPrayerTimesSection
              weeklyData={adjustedWeeklyTimes}
              isLoading={weeklyLoading}
              error={weeklyError}
            />
          </MotifFrame>

          <MotifFrame>
            <PrayerTimesSection
              onNavigateToLocation={handleNavigateToLocation}
            />
          </MotifFrame>

          <PrayerTimeCardsSection
            adjustedTimes={adjustedTimes}
            isLoading={prayerLoading}
            error={prayerError}
          />

          <MotifFrame>
            <WeatherSection onNavigateToLocation={handleNavigateToLocation} />
          </MotifFrame>
        </>
      )}
    </div>
  );
}
