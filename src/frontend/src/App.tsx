import React from 'react';
import { MobileTabsNav } from './components/MobileTabsNav';
import { HomeTab } from './features/home/HomeTab';
import { SettingsTab } from './features/settings/SettingsTab';
import { EsmaulHusnaTab } from './features/esmaulhusna/EsmaulHusnaTab';
import { ZikirmatikTab } from './features/zikirmatik/ZikirmatikTab';
import { NamazOgreticiTab } from './features/namaz-ogretici/NamazOgreticiTab';
import { CumaHutbesiTab } from './features/sermon/CumaHutbesiTab';

function App() {
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
                  alt="Merhaba Hadi Namaza"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold font-display">Merhaba Hadi Namaza</h1>
                  <p className="text-xs text-muted-foreground">Namaz Vakitleri</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <MobileTabsNav
            children={{
              home: <HomeTab />,
              settings: <SettingsTab />,
              esmaulhusna: <EsmaulHusnaTab />,
              zikirmatik: <ZikirmatikTab />,
              namazogretici: <NamazOgreticiTab />,
              cumahutbesi: <CumaHutbesiTab />
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
