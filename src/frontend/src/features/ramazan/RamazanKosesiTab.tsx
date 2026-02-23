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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Ramazan Köşesi
            </CardTitle>
            <CardDescription>
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
                <Button className="w-full mt-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Konum Seç
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Konumunuzu Seçin</DialogTitle>
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {tarawihContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {tarawihContent.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-base text-primary">{section.heading}</h3>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground">
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
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Günün Ramazan Menüsü
            </CardTitle>
            <CardDescription>
              Sağlıklı sahur ve iftar önerileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sahur */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-primary">Sahur Önerileri</h3>
              <ul className="space-y-2">
                {todaysMenu.sahur.map((item, index) => (
                  <li key={index} className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Iftar */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-primary">İftar Önerileri</h3>
              <ul className="space-y-2">
                {todaysMenu.iftar.map((item, index) => (
                  <li key={index} className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Menüler her gün otomatik olarak değişir
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fasting Basics - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Oruçla İlgili Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fastingBasicsContent.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-base text-primary">{section.heading}</h3>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground">
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

  return (
    <div className="space-y-4">
      {/* Location Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Mevcut Konum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium">{settings.location.displayName}</p>
            <p className="text-xs text-muted-foreground">
              {settings.location.latitude.toFixed(4)}°, {settings.location.longitude.toFixed(4)}°
            </p>
          </div>
          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Konumu Değiştir
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Konumu Değiştir</DialogTitle>
                <DialogDescription>
                  Yeni bir şehir veya ilçe arayın
                </DialogDescription>
              </DialogHeader>
              <LocationSetupSection onLocationSelected={handleLocationSelected} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* İmsakiye Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            İmsakiye
          </CardTitle>
          <CardDescription>
            Bugünün oruç vakitleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Yükleniyor...</span>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Vakitler yüklenirken bir hata oluştu'}
              </AlertDescription>
            </Alert>
          )}

          {adjustedTimes && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* İmsak (Fajr) */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex-shrink-0">
                    <Moon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">İmsak</p>
                    <p className="text-lg font-bold text-foreground">{adjustedTimes.fajr}</p>
                  </div>
                </div>

                {/* Güneş (Sunrise) */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex-shrink-0">
                    <Sunrise className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Güneş</p>
                    <p className="text-lg font-bold text-foreground">{adjustedTimes.sunrise}</p>
                  </div>
                </div>

                {/* İftar (Maghrib) */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex-shrink-0">
                    <Sunset className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">İftar</p>
                    <p className="text-lg font-bold text-foreground">{adjustedTimes.maghrib}</p>
                  </div>
                </div>

                {/* Yatsı (Isha) */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Yatsı</p>
                    <p className="text-lg font-bold text-foreground">{adjustedTimes.isha}</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  {adjustedTimes.date}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teravih Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {tarawihContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tarawihContent.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-base text-primary">{section.heading}</h3>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground">
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
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Günün Ramazan Menüsü
          </CardTitle>
          <CardDescription>
            Sağlıklı sahur ve iftar önerileri
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sahur */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base text-primary">Sahur Önerileri</h3>
            <ul className="space-y-2">
              {todaysMenu.sahur.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Iftar */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base text-primary">İftar Önerileri</h3>
            <ul className="space-y-2">
              {todaysMenu.iftar.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Menüler her gün otomatik olarak değişir
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fasting Basics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Oruçla İlgili Temel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {fastingBasicsContent.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-base text-primary">{section.heading}</h3>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground">
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
