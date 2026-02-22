import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useAppSettings } from '../settings/useAppSettings';
import { LocationSetupSection } from '../location/LocationSetupSection';
import { usePrayerTimes } from '../prayer/usePrayerTimes';
import { applyOffsetToPrayerTimes } from '../prayer/timeOffset';
import { MapPin, Moon, Sunrise, Sunset, Clock, BookOpen, Loader2, Sparkles, UtensilsCrossed } from 'lucide-react';
import { fastingBasicsContent } from './fastingBasicsContent';
import { tarawihContent } from './tarawihContent';
import { useDailyRotatingRamadanMenu } from './useDailyRotatingRamadanMenu';

export function RamazanKosesiTab() {
  const { settings } = useAppSettings();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
  const { data: prayerTimes, isLoading, isError, error } = usePrayerTimes(settings.location);
  
  const adjustedTimes = prayerTimes && settings.offsetMinutes !== undefined
    ? applyOffsetToPrayerTimes(prayerTimes, settings.offsetMinutes)
    : prayerTimes;

  const todaysMenu = useDailyRotatingRamadanMenu();

  const handleLocationSelected = () => {
    setIsLocationDialogOpen(false);
  };

  // No location set - show prompt
  if (!settings.location) {
    return (
      <div className="space-y-4 sm:space-y-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              Ramazan Köşesi
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              İmsakiye ve oruçla ilgili temel bilgiler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertTitle>Konum Gerekli</AlertTitle>
              <AlertDescription>
                İmsakiye bilgilerini görmek için lütfen konumunuzu seçin.
              </AlertDescription>
            </Alert>
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 min-h-[44px] sm:min-h-[48px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  Konum Seç
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Konumunuzu Seçin</DialogTitle>
                  <DialogDescription>
                    Konumunuzu ayarlamak için şehir veya ilçe arayın
                  </DialogDescription>
                </DialogHeader>
                <LocationSetupSection onLocationSelected={handleLocationSelected} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Teravih Section - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              {tarawihContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {tarawihContent.sections.map((section, index) => (
              <div key={index} className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-sm sm:text-base text-primary">{section.heading}</h3>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ramadan Menus - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
              Günün Ramazan Menüsü
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sağlıklı sahur ve iftar önerileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Sahur */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base text-primary">Sahur Önerileri</h3>
              <ul className="space-y-2">
                {todaysMenu.sahur.map((item, index) => (
                  <li key={index} className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Iftar */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base text-primary">İftar Önerileri</h3>
              <ul className="space-y-2">
                {todaysMenu.iftar.map((item, index) => (
                  <li key={index} className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              Menüler her gün otomatik olarak değişir
            </div>
          </CardContent>
        </Card>

        {/* Fasting Basics - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              Oruç Hakkında Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {fastingBasicsContent.map((section, index) => (
              <div key={index} className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-sm sm:text-base text-primary">{section.heading}</h3>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Location is set - show full content
  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* İmsakiye Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              İmsakiye
            </CardTitle>
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 mr-2" />
                  Değiştir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Konumunuzu Seçin</DialogTitle>
                  <DialogDescription>
                    Konumunuzu ayarlamak için şehir veya ilçe arayın
                  </DialogDescription>
                </DialogHeader>
                <LocationSetupSection onLocationSelected={handleLocationSelected} />
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="text-xs sm:text-sm">{settings.location.displayName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                Namaz vakitleri alınamadı. Lütfen daha sonra tekrar deneyin.
              </AlertDescription>
            </Alert>
          )}

          {adjustedTimes && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* İmsak (Sahur) */}
              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sunrise className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100">İmsak (Sahur)</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold tabular-nums text-blue-900 dark:text-blue-100">
                  {adjustedTimes.fajr}
                </p>
              </div>

              {/* İftar */}
              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sunset className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold text-sm sm:text-base text-orange-900 dark:text-orange-100">İftar</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold tabular-nums text-orange-900 dark:text-orange-100">
                  {adjustedTimes.maghrib}
                </p>
              </div>
            </div>
          )}

          {adjustedTimes && (
            <div className="pt-2 sm:pt-3 border-t">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Diğer Vakitler</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Güneş</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums">{adjustedTimes.sunrise}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Öğle</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums">{adjustedTimes.dhuhr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">İkindi</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums">{adjustedTimes.asr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Yatsı</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums">{adjustedTimes.isha}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teravih Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            {tarawihContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {tarawihContent.sections.map((section, index) => (
            <div key={index} className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base text-primary">{section.heading}</h3>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ramadan Menus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
            Günün Ramazan Menüsü
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Sağlıklı sahur ve iftar önerileri
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Sahur */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base text-primary">Sahur Önerileri</h3>
            <ul className="space-y-2">
              {todaysMenu.sahur.map((item, index) => (
                <li key={index} className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Iftar */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base text-primary">İftar Önerileri</h3>
            <ul className="space-y-2">
              {todaysMenu.iftar.map((item, index) => (
                <li key={index} className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            Menüler her gün otomatik olarak değişir
          </div>
        </CardContent>
      </Card>

      {/* Fasting Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            Oruç Hakkında Temel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {fastingBasicsContent.map((section, index) => (
            <div key={index} className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base text-primary">{section.heading}</h3>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
