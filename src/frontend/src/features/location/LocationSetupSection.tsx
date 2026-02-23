import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useGeocodingSearch } from './useGeocodingSearch';
import { useAppSettings } from '../settings/useAppSettings';
import { setDurableLocation } from '../settings/durableLocationStorage';
import { saveManualLocationToLocalStorage } from '../settings/localSettingsStorage';
import type { Location } from './types';

interface LocationSetupSectionProps {
  onLocationSelected?: () => void;
}

export function LocationSetupSection({ onLocationSelected }: LocationSetupSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results, isLoading } = useGeocodingSearch(searchQuery);
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [savingLocation, setSavingLocation] = useState(false);

  const handleSelectLocation = async (location: Location) => {
    setSavingLocation(true);
    try {
      // Save to all storage mechanisms
      await setDurableLocation(location);
      saveManualLocationToLocalStorage(location);
      
      // Save to main settings
      await saveSettings({
        ...settings,
        location
      });

      console.log('[LocationSetup] Location saved successfully:', location.displayName);
      
      if (onLocationSelected) {
        onLocationSelected();
      }
    } catch (error) {
      console.error('[LocationSetup] Failed to save location:', error);
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          Konum Seçimi
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Namaz vakitlerini görmek için şehir veya bölge adı girin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Örn: İstanbul, Ankara, İzmir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {results.map((result) => (
              <Button
                key={result.id}
                variant="outline"
                className="w-full justify-start min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                onClick={() => handleSelectLocation({
                  displayName: result.name,
                  latitude: result.latitude,
                  longitude: result.longitude
                })}
                disabled={isSaving || savingLocation}
              >
                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-left">
                  {result.name}
                  {result.admin1 && `, ${result.admin1}`}
                  {result.country && ` - ${result.country}`}
                </span>
              </Button>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && !isLoading && results && results.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sonuç bulunamadı. Farklı bir arama deneyin.
          </p>
        )}

        {searchQuery.length < 2 && (
          <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
            Arama yapmak için en az 2 karakter girin
          </p>
        )}
      </CardContent>
    </Card>
  );
}
