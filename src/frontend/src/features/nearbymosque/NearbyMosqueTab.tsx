import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useAppSettings } from '../settings/useAppSettings';
import { useNearbyMosques } from './useNearbyMosques';
import { formatDistance } from './distance';
import { NearbyMosqueLocationSearch } from './NearbyMosqueLocationSearch';
import type { Location } from '../location/types';

export function NearbyMosqueTab() {
  const { settings, saveSettings } = useAppSettings();
  const [tempLocation, setTempLocation] = useState<Location | null>(null);

  const activeLocation = tempLocation || settings.location;
  const { data: mosques, isLoading, error } = useNearbyMosques({
    latitude: activeLocation?.latitude ?? null,
    longitude: activeLocation?.longitude ?? null,
    radiusKm: 5
  });

  const handleLocationSelected = async (location: Location, saveToSettings: boolean) => {
    if (saveToSettings) {
      try {
        await saveSettings({ location });
        setTempLocation(null);
        alert('Konum varsayılan olarak kaydedildi');
      } catch (error) {
        console.error('Failed to save location as default:', error);
        alert('Konum kaydedilemedi');
      }
    } else {
      setTempLocation(location);
    }
  };

  const handleClearTempLocation = () => {
    setTempLocation(null);
  };

  const openInMaps = (lat: number, lon: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Konum
          </CardTitle>
          <CardDescription>
            {activeLocation
              ? 'Seçili konum için yakındaki camiler gösteriliyor'
              : 'Yakındaki camileri görmek için konum seçin'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NearbyMosqueLocationSearch 
            onLocationSelected={handleLocationSelected}
            currentLocation={tempLocation}
            onClearTemporary={handleClearTempLocation}
          />
        </CardContent>
      </Card>

      {activeLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Yakındaki Camiler
            </CardTitle>
            <CardDescription>
              {activeLocation.displayName} çevresindeki camiler (5 km yarıçap)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="text-muted-foreground">Camiler aranıyor...</p>
            )}

            {error && (
              <p className="text-destructive">Camiler yüklenirken bir hata oluştu</p>
            )}

            {mosques && mosques.length === 0 && (
              <p className="text-muted-foreground">Yakında cami bulunamadı</p>
            )}

            {mosques && mosques.length > 0 && (
              <div className="space-y-3">
                {mosques.map((mosque) => (
                  <div
                    key={mosque.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{mosque.name}</h3>
                        {mosque.address && (
                          <p className="text-sm text-muted-foreground mb-2">{mosque.address}</p>
                        )}
                        <p className="text-sm font-medium text-primary">
                          {formatDistance(mosque.distanceMeters)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInMaps(mosque.latitude, mosque.longitude, mosque.name)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
