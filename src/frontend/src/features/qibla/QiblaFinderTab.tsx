import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useAppSettings } from '../settings/useAppSettings';
import { LocationSetupSection } from '../location/LocationSetupSection';
import { useDeviceOrientation } from './useDeviceOrientation';
import { calculateQiblaBearing, normalizeAngle } from './qiblaMath';
import { Compass, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

export function QiblaFinderTab() {
  const { settings } = useAppSettings();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { heading, isSupported, isPermissionDenied, isLoading, requestPermission } = useDeviceOrientation();

  // Calculate Qibla bearing if location is set
  const qiblaBearing = settings.location
    ? calculateQiblaBearing(settings.location.latitude, settings.location.longitude)
    : null;

  // Calculate arrow rotation (Qibla direction relative to device heading)
  const arrowRotation = qiblaBearing !== null && heading !== null
    ? normalizeAngle(qiblaBearing - heading)
    : 0;

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
              <Compass className="h-5 w-5" />
              Kıble Bulucu
            </CardTitle>
            <CardDescription>
              Cihazınızın pusulasını kullanarak Kıble yönünü bulun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertTitle>Konum Gerekli</AlertTitle>
              <AlertDescription>
                Kıble yönünü hesaplamak için lütfen konumunuzu seçin.
              </AlertDescription>
            </Alert>
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Konum Seç
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="location-setup-description">
                <DialogHeader>
                  <DialogTitle>Konumunuzu Seçin</DialogTitle>
                  <DialogDescription id="location-setup-description">
                    Konumunuzu ayarlamak için şehir veya ilçe arayın
                  </DialogDescription>
                </DialogHeader>
                <LocationSetupSection onLocationSelected={handleLocationSelected} />
              </DialogContent>
            </Dialog>
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
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="change-location-description">
              <DialogHeader>
                <DialogTitle>Konumu Değiştir</DialogTitle>
                <DialogDescription id="change-location-description">
                  Yeni bir şehir veya ilçe arayın
                </DialogDescription>
              </DialogHeader>
              <LocationSetupSection onLocationSelected={handleLocationSelected} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Qibla Direction Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Kıble Yönü
          </CardTitle>
          <CardDescription>
            Cihazınızı kuzeye doğrultun ve oku takip edin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qiblaBearing !== null && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Konumunuzdan Kıble açısı:</p>
              <p className="text-2xl font-bold text-primary">{qiblaBearing.toFixed(1)}°</p>
            </div>
          )}

          {/* Compass Display */}
          <div className="relative w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-full p-8 border-2 border-accent/30">
            {/* Compass Rose Background */}
            <div className="absolute inset-8 rounded-full border-2 border-accent/20 flex items-center justify-center">
              <div className="absolute top-2 text-xs font-semibold text-accent-foreground">K</div>
              <div className="absolute bottom-2 text-xs font-semibold text-muted-foreground">G</div>
              <div className="absolute right-2 text-xs font-semibold text-muted-foreground">D</div>
              <div className="absolute left-2 text-xs font-semibold text-muted-foreground">B</div>
            </div>

            {/* Qibla Arrow */}
            {heading !== null ? (
              <div
                className="absolute inset-8 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${arrowRotation}deg)` }}
              >
                <Navigation className="h-24 w-24 text-primary fill-primary drop-shadow-lg" />
              </div>
            ) : (
              <div className="absolute inset-8 flex items-center justify-center">
                <Compass className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Permission/Support Messages */}
          {!isSupported && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pusula Desteklenmiyor</AlertTitle>
              <AlertDescription>
                Cihazınız pusula sensörünü desteklemiyor.
              </AlertDescription>
            </Alert>
          )}

          {isSupported && isPermissionDenied && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>İzin Gerekli</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Pusula kullanmak için cihaz yönlendirme izni gerekiyor.</p>
                <Button onClick={requestPermission} size="sm" className="mt-2">
                  İzin Ver
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isSupported && !isPermissionDenied && heading === null && !isLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pusula Verisi Bekleniyor</AlertTitle>
              <AlertDescription>
                Cihazınızı hareket ettirerek pusula sensörünü aktifleştirin.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
