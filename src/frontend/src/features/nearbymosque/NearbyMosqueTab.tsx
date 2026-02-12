import React, { useState } from 'react';
import { useAppSettings } from '../settings/useAppSettings';
import { useNearbyMosques } from './useNearbyMosques';
import { NearbyMosqueLocationSearch } from './NearbyMosqueLocationSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { MapPin, ExternalLink, AlertCircle, Search } from 'lucide-react';
import { formatDistance } from './distance';
import type { Location } from '../location/types';
import { useQueryClient } from '@tanstack/react-query';

interface NearbyMosqueTabProps {
  onNavigateToSettings: () => void;
}

export function NearbyMosqueTab({ onNavigateToSettings }: NearbyMosqueTabProps) {
  const { settings, saveSettings } = useAppSettings();
  const queryClient = useQueryClient();
  const [radiusKm, setRadiusKm] = useState(3);
  const [temporaryLocation, setTemporaryLocation] = useState<Location | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Use temporary location if set, otherwise fall back to saved settings location
  const activeLocation = temporaryLocation || settings?.location || null;

  const { data: mosques, isLoading, error } = useNearbyMosques({
    latitude: activeLocation?.latitude ?? null,
    longitude: activeLocation?.longitude ?? null,
    radiusKm,
  });

  const handleLocationSelected = async (location: Location, saveToSettings: boolean) => {
    if (saveToSettings) {
      // Save to app settings and clear temporary
      await saveSettings({
        ...settings,
        location
      });
      setTemporaryLocation(null);
      // Invalidate queries that depend on location
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      queryClient.invalidateQueries({ queryKey: ['weather'] });
      queryClient.invalidateQueries({ queryKey: ['prayerTimes'] });
    } else {
      // Use as temporary location only
      setTemporaryLocation(location);
    }
    setShowSearch(false);
  };

  const handleClearTemporary = () => {
    setTemporaryLocation(null);
  };

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 3, label: '3 km' },
    { value: 5, label: '5 km' },
  ];

  const openInMaps = (latitude: number, longitude: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Show search interface if no location or user clicked search
  if (!activeLocation || showSearch) {
    return (
      <div className="space-y-4">
        <NearbyMosqueLocationSearch
          onLocationSelected={handleLocationSelected}
          currentLocation={activeLocation}
          onClearTemporary={handleClearTemporary}
        />
        {activeLocation && (
          <Button
            variant="outline"
            onClick={() => setShowSearch(false)}
            className="w-full"
          >
            Cami Listesine Dön
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Yakındaki Camiler
          </CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>{activeLocation.displayName} konumunuza yakın camiler</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="h-8 gap-1"
            >
              <Search className="h-3.5 w-3.5" />
              Değiştir
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Radius Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Arama Yarıçapı</label>
            <div className="flex gap-2">
              {radiusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={radiusKm === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRadiusKm(option.value)}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Camiler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && mosques && mosques.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Bu yarıçapta kayıtlı cami bulunamadı. Daha geniş bir yarıçap seçmeyi deneyin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mosques List */}
      {!isLoading && !error && mosques && mosques.length > 0 && (
        <div className="space-y-3">
          {mosques.map((mosque) => (
            <Card key={mosque.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">{mosque.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="font-medium text-primary">
                        {formatDistance(mosque.distanceMeters)}
                      </span>
                    </div>
                    {mosque.address && (
                      <p className="text-xs text-muted-foreground truncate">{mosque.address}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInMaps(mosque.latitude, mosque.longitude, mosque.name)}
                    aria-label={`${mosque.name} haritada aç`}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
