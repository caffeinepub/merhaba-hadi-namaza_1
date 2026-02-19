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
    <div className="space-y-3 sm:space-y-4">
      {/* Current Location Display */}
      {currentLocation && (
        <Card className="bg-accent/20 border-accent">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
                Aktif Konum
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearTemporary}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px]"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm font-medium">{currentLocation.displayName}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Konum Ara
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Mahalle, ilçe veya şehir adını yazarak konum arayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mosque-location-search" className="text-sm sm:text-base">Mahalle/İlçe/Şehir Adı</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mosque-location-search"
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
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left p-3 sm:p-4 rounded-lg border hover:bg-accent/10 transition-colors min-h-[44px] sm:min-h-[48px]"
                    >
                      <p className="font-medium text-xs sm:text-sm">{location.displayName}</p>
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
            <p className="text-xs sm:text-sm text-muted-foreground">Sonuç bulunamadı</p>
          )}

          {selectedResult && (
            <Card className="bg-primary/10 border-primary">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Seçili Konum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-medium">
                  {geocodingResultToLocation(selectedResult).displayName}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    onClick={handleUseTemporary} 
                    variant="outline" 
                    className="flex-1 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                  >
                    Geçici Kullan
                  </Button>
                  <Button 
                    onClick={handleSaveAsDefault} 
                    className="flex-1 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                  >
                    Varsayılan Yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
