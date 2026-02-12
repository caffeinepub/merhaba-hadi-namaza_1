import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useGeocodingSearch } from '../location/useGeocodingSearch';
import { geocodingResultToLocation } from '../location/openMeteoGeocoding';
import { MapPin, Search, X } from 'lucide-react';
import type { GeocodingResult, Location } from '../location/types';

interface NearbyMosqueLocationSearchProps {
  onLocationSelected: (location: Location, saveToSettings: boolean) => void;
  currentLocation: Location | null;
  onClearTemporary: () => void;
}

export function NearbyMosqueLocationSearch({
  onLocationSelected,
  currentLocation,
  onClearTemporary
}: NearbyMosqueLocationSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedResult, setSelectedResult] = useState<GeocodingResult | null>(null);
  const { data: results, isLoading: isSearching } = useGeocodingSearch(searchText);

  const handleSelectResult = (result: GeocodingResult) => {
    setSelectedResult(result);
    setSearchText('');
  };

  const handleUseTemporary = () => {
    if (selectedResult) {
      const location = geocodingResultToLocation(selectedResult);
      onLocationSelected(location, false);
      setSelectedResult(null);
    }
  };

  const handleSaveAsDefault = () => {
    if (selectedResult) {
      const location = geocodingResultToLocation(selectedResult);
      onLocationSelected(location, true);
      setSelectedResult(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Location Display */}
      {currentLocation && (
        <Card className="bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent-foreground" />
                Aktif Konum
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearTemporary}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{currentLocation.displayName}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Konum Ara
          </CardTitle>
          <CardDescription>
            Mahalle, ilçe veya şehir adını yazarak konum arayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mosque-location-search">Mahalle/İlçe/Şehir Adı</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mosque-location-search"
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
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent/10 transition-colors"
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

      {/* Action Selection Card */}
      {selectedResult && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Konum Seçildi</CardTitle>
            <CardDescription>
              {geocodingResultToLocation(selectedResult).displayName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Bu konumu nasıl kullanmak istersiniz?
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleUseTemporary}
                variant="outline"
                className="w-full justify-start"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Sadece bu sekmede kullan
              </Button>
              <Button
                onClick={handleSaveAsDefault}
                variant="default"
                className="w-full justify-start"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Varsayılan konum olarak kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
