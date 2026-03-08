import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { setDurableLocation } from "../settings/durableLocationStorage";
import {
  loadLocalSettings,
  saveLocalSettingsSync,
  saveManualLocationToLocalStorage,
} from "../settings/localSettingsStorage";
import type { Location } from "./types";
import { useGeocodingSearch } from "./useGeocodingSearch";

interface LocationSetupSectionProps {
  onLocationSelected?: () => void;
}

export function LocationSetupSection({
  onLocationSelected,
}: LocationSetupSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedLocation, setSavedLocation] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: results, isLoading } = useGeocodingSearch(searchQuery);

  const handleSelectLocation = async (location: Location) => {
    if (savingLocation) return;
    setSavingLocation(true);
    setSaveError(null);
    setSavedLocation(null);

    try {
      // 1. Save to all storage mechanisms directly (no dependency on useAppSettings mutation)
      saveManualLocationToLocalStorage(location);

      // 2. Save to durable storage (IndexedDB + backups) - don't await, fire and forget
      setDurableLocation(location).catch((err) => {
        console.warn(
          "[LocationSetup] Durable storage save failed (non-critical):",
          err,
        );
      });

      // 3. Load current settings and update location, then save synchronously
      try {
        const currentSettings = await loadLocalSettings();
        const updatedSettings = { ...currentSettings, location };
        saveLocalSettingsSync(updatedSettings);
      } catch (settingsErr) {
        console.warn(
          "[LocationSetup] Settings update failed, using direct save:",
          settingsErr,
        );
        // Fallback: save minimal settings with just the location
        saveLocalSettingsSync({
          location,
          offsetMinutes: 0,
          notificationLeadTimes: {
            fajr: 15,
            sunrise: 15,
            dhuhr: 15,
            asr: 15,
            maghrib: 15,
            isha: 15,
          },
        });
      }

      // 4. Invalidate the React Query cache so all components re-read from storage
      await queryClient.invalidateQueries({ queryKey: ["appSettings"] });

      // 5. Force immediate re-read of settings and prayer times for new location
      await queryClient.refetchQueries({ queryKey: ["appSettings"] });
      queryClient.refetchQueries({ queryKey: ["prayerTimes"] });

      setSavedLocation(location.displayName);

      // 6. Notify parent after a brief moment to show success state
      setTimeout(() => {
        if (onLocationSelected) {
          onLocationSelected();
        }
      }, 300);
    } catch (error) {
      console.error("[LocationSetup] Failed to save location:", error);
      setSaveError("Konum kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          Konum Ara
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Namaz vakitlerini görmek için şehir veya bölge adı girin
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Örn: İstanbul, Ankara, İzmir..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
          disabled={savingLocation}
        />
      </div>

      {saveError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {savedLocation && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>{savedLocation}</strong> seçildi
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {savingLocation && (
        <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Konum kaydediliyor...</span>
        </div>
      )}

      {!savingLocation && results && results.length > 0 && (
        <div className="space-y-2 max-h-[40vh] overflow-y-auto border rounded-lg p-2">
          {results.map((result) => (
            <Button
              key={result.id}
              variant="outline"
              className="w-full justify-start min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
              onClick={() =>
                handleSelectLocation({
                  displayName: result.name,
                  latitude: result.latitude,
                  longitude: result.longitude,
                })
              }
              disabled={savingLocation}
            >
              <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-left">
                {result.name}
                {result.admin1 && `, ${result.admin1}`}
                {result.country && ` - ${result.country}`}
              </span>
            </Button>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 &&
        !isLoading &&
        results &&
        results.length === 0 && (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Sonuç bulunamadı. Farklı bir arama deneyin.
            </p>
          </div>
        )}

      {searchQuery.length < 2 && !isLoading && (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Arama yapmak için en az 2 karakter girin
          </p>
        </div>
      )}
    </div>
  );
}
