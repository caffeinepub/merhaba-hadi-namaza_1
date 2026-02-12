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
import { CompactWeatherSummary } from './features/weather/CompactWeatherSummary';
import { UpdateAvailablePrompt } from './features/app-release/UpdateAvailablePrompt';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 pattern-bg opacity-5 pointer-events-none" />

      {/* Main container */}
      <div className="relative">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/merhaba-hadi-namaza-icon.dim_512x512.png"
                  alt="Hadi Namaza"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold font-display">Hadi Namaza</h1>
                  <p className="text-xs text-muted-foreground">Namaz Vakitleri</p>
                </div>
              </div>

              {/* Right action area: Weather + Settings */}
              <div className="flex items-center gap-2">
                <CompactWeatherSummary />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTab('settings')}
                  aria-label="Ayarlar"
                  className="h-9 w-9"
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
              nearbymosque: <NearbyMosqueTab onNavigateToSettings={() => setActiveTab('settings')} />,
              fastingtracker: <FastingTrackerTab />
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
