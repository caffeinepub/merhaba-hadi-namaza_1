import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useGeocodingSearch } from './useGeocodingSearch';
import { geocodingResultToLocation } from './openMeteoGeocoding';
import { useAppSettings } from '../settings/useAppSettings';
import { MapPin, Search, Check } from 'lucide-react';
import type { GeocodingResult } from './types';

interface LocationSetupSectionProps {
  onLocationSelected?: () => void;
}

export function LocationSetupSection({ onLocationSelected }: LocationSetupSectionProps) {
  const [searchText, setSearchText] = useState('');
  const { data: results, isLoading: isSearching } = useGeocodingSearch(searchText);
  const { settings, saveSettings, isSaving } = useAppSettings();

  const handleSelectLocation = async (result: GeocodingResult) => {
    const location = geocodingResultToLocation(result);
    await saveSettings({
      ...settings,
      location
    });
    setSearchText('');
    if (onLocationSelected) {
      onLocationSelected();
    }
  };

  return (
    <div className="space-y-4">
      {settings.location && (
        <Card className="bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="h-5 w-5 text-accent-foreground" />
              Seçili Konum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{settings.location.displayName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.location.latitude.toFixed(4)}, {settings.location.longitude.toFixed(4)}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Konum Ara
          </CardTitle>
          <CardDescription>
            İlçe veya şehir adını yazarak konum arayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-search">İlçe/Şehir Adı</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Örn: Kadıköy, İstanbul"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isSearching && (
            <p className="text-sm text-muted-foreground">Aranıyor...</p>
          )}

          {results && results.length > 0 && (
            <div className="space-y-2">
              <Label>Sonuçlar</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result) => {
                  const location = geocodingResultToLocation(result);
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectLocation(result)}
                      disabled={isSaving}
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent/10 transition-colors disabled:opacity-50"
                    >
                      <p className="font-medium text-sm">{location.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {results && results.length === 0 && searchText.length >= 2 && !isSearching && (
            <p className="text-sm text-muted-foreground">Sonuç bulunamadı</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
