import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useGeocodingSearch } from './useGeocodingSearch';
import { geocodingResultToLocation } from './openMeteoGeocoding';
import { useAppSettings } from '../settings/useAppSettings';
import { saveManualLocationToLocalStorage } from '../settings/localSettingsStorage';
import { MapPin, Search, Loader2 } from 'lucide-react';
import type { GeocodingResult } from './types';

interface LocationSetupSectionProps {
  onLocationSelected?: () => void;
}

export function LocationSetupSection({ onLocationSelected }: LocationSetupSectionProps) {
  const { settings, saveSettings } = useAppSettings();
  const [searchText, setSearchText] = useState('');
  const [savingLocationId, setSavingLocationId] = useState<number | null>(null);
  const { data: results, isLoading: isSearching } = useGeocodingSearch(searchText);

  const handleSelectLocation = async (result: GeocodingResult) => {
    setSavingLocationId(result.id);
    try {
      const location = geocodingResultToLocation(result);
      
      // Save to localStorage first for immediate persistence
      saveManualLocationToLocalStorage(location);
      
      // Then save to app settings
      await saveSettings({ location });
      
      setSearchText('');
      
      if (onLocationSelected) {
        onLocationSelected();
      }
    } catch (error) {
      console.error('Failed to save location:', error);
      alert('Konum kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSavingLocationId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Location Display */}
      {settings.location && (
        <Card className="bg-accent/20 border-accent">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              Kayıtlı Konum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base font-medium">{settings.location.displayName}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Konum Değiştir
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Mahalle, ilçe veya şehir adını yazarak konum arayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-search" className="text-sm sm:text-base">Mahalle/İlçe/Şehir Adı</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Örn: Kadıköy, İstanbul"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 h-11 sm:h-12 text-sm sm:text-base"
              />
            </div>
          </div>

          {isSearching && (
            <p className="text-xs sm:text-sm text-muted-foreground">Aranıyor...</p>
          )}

          {results && results.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Sonuçlar</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result) => {
                  const location = geocodingResultToLocation(result);
                  const isSaving = savingLocationId === result.id;
                  
                  return (
                    <Button
                      key={result.id}
                      onClick={() => handleSelectLocation(result)}
                      disabled={isSaving}
                      variant="outline"
                      className="w-full justify-start text-left p-3 sm:p-4 h-auto min-h-[44px] sm:min-h-[48px]"
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2 w-full">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs sm:text-sm">Kaydediliyor...</span>
                        </div>
                      ) : (
                        <div className="w-full">
                          <p className="font-medium text-xs sm:text-sm">{location.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                          </p>
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {results && results.length === 0 && searchText.length >= 2 && !isSearching && (
            <p className="text-xs sm:text-sm text-muted-foreground">Sonuç bulunamadı</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
