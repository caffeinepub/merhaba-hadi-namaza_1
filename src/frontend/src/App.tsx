import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { MobileTabsNav } from './components/MobileTabsNav';
import { HomeTab } from './features/home/HomeTab';
import { PrayerTimesSection } from './features/prayer/PrayerTimesSection';
import { WeatherSection } from './features/weather/WeatherSection';
import { LocationSetupSection } from './features/location/LocationSetupSection';
import { SettingsTab } from './features/settings/SettingsTab';
import { EsmaulHusnaTab } from './features/esmaulhusna/EsmaulHusnaTab';
import { NamazOgreticiTab } from './features/namaz-ogretici/NamazOgreticiTab';
import { QiblaFinderTab } from './features/qibla/QiblaFinderTab';
import { RamazanKosesiTab } from './features/ramazan/RamazanKosesiTab';
import { HatimTakipTab } from './features/hatim/HatimTakipTab';
import { MorningEveningAdhkarTab } from './features/adhkar/MorningEveningAdhkarTab';
import { DuaGuideTab } from './features/dua-guide/DuaGuideTab';
import { TasbihatTab } from './features/tasbihat/TasbihatTab';
import { ReligiousDaysTab } from './features/religious-days/ReligiousDaysTab';
import { ZikirmatikTab } from './features/zikirmatik/ZikirmatikTab';
import { NearbyMosqueTab } from './features/nearbymosque/NearbyMosqueTab';
import { FastingTrackerTab } from './features/fasting-tracker/FastingTrackerTab';
import { PrayerTrackerTab } from './features/prayer-tracker/PrayerTrackerTab';
import { QuranOgreniyorumTab } from './features/quran-reading/QuranOgreniyorumTab';
import { HeaderFlourish } from './components/HeaderFlourish';
import { useAppSettings } from './features/settings/useAppSettings';
import { getManualLocationFromLocalStorage } from './features/settings/localSettingsStorage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = React.useState('home');
  const { settings, saveSettings } = useAppSettings();

  // Load saved location from localStorage on mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      // Only load if no location is currently set
      if (!settings.location) {
        const manualLocation = getManualLocationFromLocalStorage();
        if (manualLocation) {
          try {
            await saveSettings({ location: manualLocation });
          } catch (error) {
            console.error('Failed to restore saved location:', error);
          }
        }
      }
    };

    loadSavedLocation();
  }, []); // Run once on mount

  const handleNavigateToLocation = () => {
    setActiveTab('location');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/islamic-pattern-vivid-bg.dim_1600x900.png)',
          backgroundSize: '400px 225px',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative">
        <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800 text-white shadow-lg border-b-2 border-emerald-700/30 dark:border-emerald-500/20">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <img 
                src="/assets/generated/merhaba-hadi-namaza-icon.dim_512x512.png" 
                alt="Merhaba Hadi Namaza" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md ring-2 ring-white/30"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Merhaba Hadi Namaza
              </h1>
            </div>
            <HeaderFlourish />
          </div>
        </header>

        <main className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-24 sm:pb-28">
          <MobileTabsNav value={activeTab} onValueChange={setActiveTab}>
            {{
              home: <HomeTab />,
              settings: (
                <div className="space-y-4 sm:space-y-6">
                  <SettingsTab />
                  <div className="pt-4 sm:pt-6 border-t">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Konum Ayarları</h2>
                    <LocationSetupSection />
                  </div>
                  <div className="pt-4 sm:pt-6 border-t">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Namaz Vakitleri</h2>
                    <PrayerTimesSection onNavigateToLocation={handleNavigateToLocation} />
                  </div>
                  <div className="pt-4 sm:pt-6 border-t">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Hava Durumu</h2>
                    <WeatherSection onNavigateToLocation={handleNavigateToLocation} />
                  </div>
                </div>
              ),
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
              quranreading: <QuranOgreniyorumTab />
            }}
          </MobileTabsNav>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
