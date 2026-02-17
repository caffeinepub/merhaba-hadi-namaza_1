import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useGeocodingSearch } from './useGeocodingSearch';
import { geocodingResultToLocation } from './openMeteoGeocoding';
import { useAppSettings } from '../settings/useAppSettings';
import { MapPin, Search, Check, Loader2 } from 'lucide-react';
import type { GeocodingResult } from './types';

interface LocationSetupSectionProps {
  onLocationSelected?: () => void;
}

export function LocationSetupSection({ onLocationSelected }: LocationSetupSectionProps) {
  const [searchText, setSearchText] = useState('');
  const { data: results, isLoading: isSearching } = useGeocodingSearch(searchText);
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [savingLocationId, setSavingLocationId] = useState<string | null>(null);

  const handleSelectLocation = async (result: GeocodingResult) => {
    const location = geocodingResultToLocation(result);
    const locationId = `${result.latitude}-${result.longitude}`;
    
    try {
      setSavingLocationId(locationId);
      await saveSettings({ location });
      setSearchText('');
      if (onLocationSelected) {
        onLocationSelected();
      }
    } catch (error) {
      console.error('Failed to save location:', error);
    } finally {
      setSavingLocationId(null);
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Konum Seç
          </CardTitle>
          <CardDescription>
            Şehir veya bölge adı girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-search">Konum Ara</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Örn: İstanbul, Ankara, İzmir"
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
                  const locationId = `${result.latitude}-${result.longitude}`;
                  const isCurrentlySaving = savingLocationId === locationId;
                  
                  return (
                    <button
                      key={`${result.latitude}-${result.longitude}`}
                      onClick={() => handleSelectLocation(result)}
                      disabled={isSaving}
                      className="w-full text-left p-3 border rounded-lg hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {[result.admin1, result.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        {isCurrentlySaving && (
                          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {searchText.length >= 2 && results && results.length === 0 && !isSearching && (
            <p className="text-sm text-muted-foreground">Sonuç bulunamadı</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
