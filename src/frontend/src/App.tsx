import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";
import { HeaderFlourish } from "./components/HeaderFlourish";
import { MobileTabsNav } from "./components/MobileTabsNav";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { MorningEveningAdhkarTab } from "./features/adhkar/MorningEveningAdhkarTab";
import { UpdateAvailablePrompt } from "./features/app-release/UpdateAvailablePrompt";
import { DuaGuideTab } from "./features/dua-guide/DuaGuideTab";
import { EsmaulHusnaTab } from "./features/esmaulhusna/EsmaulHusnaTab";
import { FastingTrackerTab } from "./features/fasting-tracker/FastingTrackerTab";
import { HatimTakipTab } from "./features/hatim/HatimTakipTab";
import { HomeTab } from "./features/home/HomeTab";
import { DEFAULT_LOCATION } from "./features/location/types";
import { NamazOgreticiTab } from "./features/namaz-ogretici/NamazOgreticiTab";
import { NearbyMosqueTab } from "./features/nearbymosque/NearbyMosqueTab";
import { PrayerTrackerTab } from "./features/prayer-tracker/PrayerTrackerTab";
import { QiblaFinderTab } from "./features/qibla/QiblaFinderTab";
import { QuranOgreniyorumTab } from "./features/quran-reading/QuranOgreniyorumTab";
import { RamazanKosesiTab } from "./features/ramazan/RamazanKosesiTab";
import { ReligiousDaysTab } from "./features/religious-days/ReligiousDaysTab";
import { SettingsTab } from "./features/settings/SettingsTab";
import { useAppSettings } from "./features/settings/useAppSettings";
import { TasbihatTab } from "./features/tasbihat/TasbihatTab";
import { CompactWeatherSummary } from "./features/weather/CompactWeatherSummary";
import { ZikirmatikTab } from "./features/zikirmatik/ZikirmatikTab";
import { useDarkMode } from "./hooks/useDarkMode";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [selectedTab, setSelectedTab] = useState("home");
  const { settings, isLoading: settingsLoading } = useAppSettings();
  const { isDark, toggle } = useDarkMode();

  // Log location state on load
  useEffect(() => {
    if (!settingsLoading) {
      if (!settings.location) {
        console.log(
          "[App] No user location found, using default location:",
          DEFAULT_LOCATION.displayName,
        );
      } else {
        console.log(
          "[App] User location loaded:",
          settings.location?.displayName,
        );
      }
    }
  }, [settings.location, settingsLoading]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src="/assets/generated/merhaba-hadi-namaza-icon.dim_512x512.png"
                alt="Merhaba Hadi Namaza"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate max-w-[160px] sm:max-w-none">
                Hadi Namaza
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <CompactWeatherSummary />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label="Karanlık/Aydınlık mod"
                data-ocid="header.dark_mode_toggle"
                className="min-h-[44px] min-w-[44px] rounded-full"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </Button>
            </div>
          </div>
          <HeaderFlourish />
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-24">
        <MobileTabsNav value={selectedTab} onValueChange={setSelectedTab}>
          {{
            home: <HomeTab />,
            settings: <SettingsTab />,
            esmaulhusna: <EsmaulHusnaTab />,
            zikirmatik: <ZikirmatikTab />,
            namazogretici: <NamazOgreticiTab />,
            qibla: <QiblaFinderTab />,
            ramazan: <RamazanKosesiTab />,
            hatim: <HatimTakipTab />,
            adhkar: <MorningEveningAdhkarTab />,
            duaguide: <DuaGuideTab />,
            tasbihat: <TasbihatTab />,
            religiousdays: <ReligiousDaysTab />,
            nearbymosque: <NearbyMosqueTab />,
            fastingtracker: <FastingTrackerTab />,
            prayertracker: <PrayerTrackerTab />,
            quranreading: <QuranOgreniyorumTab />,
          }}
        </MobileTabsNav>
      </main>

      <UpdateAvailablePrompt />
      <Toaster />

      <footer className="border-t bg-muted/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined"
                  ? window.location.hostname
                  : "merhaba-hadi-namaza",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
