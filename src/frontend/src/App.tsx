import React, { useState } from 'react';
import { MobileTabsNav } from './components/MobileTabsNav';
import { HomeTab } from './features/home/HomeTab';
import { SettingsTab } from './features/settings/SettingsTab';
import { EsmaulHusnaTab } from './features/esmaulhusna/EsmaulHusnaTab';
import { ZikirmatikTab } from './features/zikirmatik/ZikirmatikTab';
import { NamazOgreticiTab } from './features/namaz-ogretici/NamazOgreticiTab';
import { QiblaFinderTab } from './features/qibla/QiblaFinderTab';
import { RamazanKosesiTab } from './features/ramazan/RamazanKosesiTab';
import { HatimTakipTab } from './features/hatim/HatimTakipTab';
import { MorningEveningAdhkarTab } from './features/adhkar/MorningEveningAdhkarTab';
import { DuaGuideTab } from './features/dua-guide/DuaGuideTab';
import { TasbihatTab } from './features/tasbihat/TasbihatTab';
import { ReligiousDaysTab } from './features/religious-days/ReligiousDaysTab';
import { NearbyMosqueTab } from './features/nearbymosque/NearbyMosqueTab';
import { FastingTrackerTab } from './features/fasting-tracker/FastingTrackerTab';
import { PrayerTrackerTab } from './features/prayer-tracker/PrayerTrackerTab';
import { QuranOgreniyorumTab } from './features/quran-reading/QuranOgreniyorumTab';
import { CompactWeatherSummary } from './features/weather/CompactWeatherSummary';
import { UpdateAvailablePrompt } from './features/app-release/UpdateAvailablePrompt';
import { HeaderFlourish } from './components/HeaderFlourish';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Enhanced decorative background with vivid motifs */}
      <div className="fixed inset-0 vivid-motif-bg opacity-15 pointer-events-none" />
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/islamic-pattern-tile.dim_512x512.png)',
          backgroundSize: '128px 128px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Main container */}
      <div className="relative">
        {/* Header with motif styling */}
        <header className="border-b-2 border-primary/20 bg-card/90 backdrop-blur-sm sticky top-0 z-10 shadow-md">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'url(/assets/generated/islamic-pattern-tile.dim_512x512.png)',
              backgroundSize: '64px 64px',
              backgroundRepeat: 'repeat'
            }}
          />
          <div className="container mx-auto px-4 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/assets/generated/merhaba-hadi-namaza-icon.dim_512x512.png"
                    alt="Hadi Namaza"
                    className="h-10 w-10 rounded-lg border-2 border-primary/30"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 opacity-40">
                    <img
                      src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold font-display">Hadi Namaza</h1>
                  <p className="text-xs text-muted-foreground">Namaz Vakitleri</p>
                </div>
              </div>

              {/* Centered flourish motif */}
              <HeaderFlourish />

              {/* Right action area: Weather + Settings */}
              <div className="flex items-center gap-2">
                <CompactWeatherSummary />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTab('settings')}
                  aria-label="Ayarlar"
                  className="h-9 w-9 border border-primary/20 hover:bg-primary/10"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          {/* Update prompt - appears below header when update is available */}
          <UpdateAvailablePrompt />

          <MobileTabsNav
            value={activeTab}
            onValueChange={setActiveTab}
            children={{
              home: <HomeTab />,
              settings: <SettingsTab />,
              adhkar: <MorningEveningAdhkarTab />,
              duaguide: <DuaGuideTab />,
              tasbihat: <TasbihatTab />,
              esmaulhusna: <EsmaulHusnaTab />,
              zikirmatik: <ZikirmatikTab />,
              hatim: <HatimTakipTab />,
              namazogretici: <NamazOgreticiTab />,
              qibla: <QiblaFinderTab />,
              ramazan: <RamazanKosesiTab />,
              religiousdays: <ReligiousDaysTab />,
              nearbymosque: <NearbyMosqueTab />,
              fastingtracker: <FastingTrackerTab />,
              prayertracker: <PrayerTrackerTab />,
              quranreading: <QuranOgreniyorumTab />
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
