import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Home, BookOpen, CircleDot, Moon } from 'lucide-react';
import { TabsOverflowMenu } from './TabsOverflowMenu';

interface MobileTabsNavProps {
  children: {
    home: React.ReactNode;
    settings: React.ReactNode;
    esmaulhusna: React.ReactNode;
    zikirmatik: React.ReactNode;
    namazogretici: React.ReactNode;
    qibla: React.ReactNode;
    ramazan: React.ReactNode;
    hatim: React.ReactNode;
    adhkar: React.ReactNode;
    duaguide: React.ReactNode;
    tasbihat: React.ReactNode;
    religiousdays: React.ReactNode;
    nearbymosque: React.ReactNode;
    fastingtracker: React.ReactNode;
    prayertracker: React.ReactNode;
    quranreading: React.ReactNode;
  };
  value?: string;
  onValueChange?: (value: string) => void;
}

export function MobileTabsNav({ children, value, onValueChange }: MobileTabsNavProps) {
  const handleTabChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange} defaultValue="home" className="w-full">
      <div className="relative">
        {/* Tile pattern background for tab bar */}
        <div
          className="absolute inset-0 rounded-lg opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/generated/islamic-pattern-tile.dim_512x512.png)',
            backgroundSize: '48px 48px',
            backgroundRepeat: 'repeat'
          }}
        />
        <TabsList className="relative grid w-full grid-cols-5 gap-0.5 sm:gap-1 h-auto p-1 border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
          <TabsTrigger 
            value="home" 
            className="flex-col gap-0.5 sm:gap-1 px-1 sm:px-2 py-2 sm:py-3 h-auto min-h-[60px] sm:min-h-[70px] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/40 border-2 border-transparent transition-all"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm font-medium">Ana Sayfa</span>
          </TabsTrigger>
          <TabsTrigger 
            value="esmaulhusna" 
            className="flex-col gap-0.5 sm:gap-1 px-1 sm:px-2 py-2 sm:py-3 h-auto min-h-[60px] sm:min-h-[70px] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/40 border-2 border-transparent transition-all"
          >
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm font-medium">Esmaül Hüsna</span>
          </TabsTrigger>
          <TabsTrigger 
            value="zikirmatik" 
            className="flex-col gap-0.5 sm:gap-1 px-1 sm:px-2 py-2 sm:py-3 h-auto min-h-[60px] sm:min-h-[70px] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/40 border-2 border-transparent transition-all"
          >
            <CircleDot className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm font-medium">Zikirmatik</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ramazan" 
            className="flex-col gap-0.5 sm:gap-1 px-1 sm:px-2 py-2 sm:py-3 h-auto min-h-[60px] sm:min-h-[70px] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/40 border-2 border-transparent transition-all"
          >
            <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm font-medium">Ramazan</span>
          </TabsTrigger>
          <TabsOverflowMenu onSelectTab={handleTabChange} />
        </TabsList>
      </div>

      <div className="mt-4 sm:mt-6">
        <TabsContent value="home">{children.home}</TabsContent>
        <TabsContent value="settings">{children.settings}</TabsContent>
        <TabsContent value="esmaulhusna">{children.esmaulhusna}</TabsContent>
        <TabsContent value="zikirmatik">{children.zikirmatik}</TabsContent>
        <TabsContent value="namazogretici">{children.namazogretici}</TabsContent>
        <TabsContent value="qibla">{children.qibla}</TabsContent>
        <TabsContent value="ramazan">{children.ramazan}</TabsContent>
        <TabsContent value="hatim">{children.hatim}</TabsContent>
        <TabsContent value="adhkar">{children.adhkar}</TabsContent>
        <TabsContent value="duaguide">{children.duaguide}</TabsContent>
        <TabsContent value="tasbihat">{children.tasbihat}</TabsContent>
        <TabsContent value="religiousdays">{children.religiousdays}</TabsContent>
        <TabsContent value="nearbymosque">{children.nearbymosque}</TabsContent>
        <TabsContent value="fastingtracker">{children.fastingtracker}</TabsContent>
        <TabsContent value="prayertracker">{children.prayertracker}</TabsContent>
        <TabsContent value="quranreading">{children.quranreading}</TabsContent>
      </div>
    </Tabs>
  );
}
