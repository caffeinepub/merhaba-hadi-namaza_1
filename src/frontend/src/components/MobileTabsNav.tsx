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
  return (
    <Tabs value={value} onValueChange={onValueChange} defaultValue="home" className="w-full">
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
        <TabsList className="relative grid w-full grid-cols-5 gap-0.5 h-auto p-1 border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
          <TabsTrigger value="home" className="flex-col gap-1 px-0.5 py-2 h-auto data-[state=active]:bg-primary/20 data-[state=active]:border data-[state=active]:border-primary/30">
            <Home className="h-4 w-4" />
            <span className="text-[9px] leading-tight hidden sm:inline">Ana Sayfa</span>
          </TabsTrigger>
          <TabsTrigger value="esmaulhusna" className="flex-col gap-1 px-0.5 py-2 h-auto data-[state=active]:bg-primary/20 data-[state=active]:border data-[state=active]:border-primary/30">
            <BookOpen className="h-4 w-4" />
            <span className="text-[9px] leading-tight hidden sm:inline">Esmaül Hüsna</span>
          </TabsTrigger>
          <TabsTrigger value="ramazan" className="flex-col gap-1 px-0.5 py-2 h-auto data-[state=active]:bg-primary/20 data-[state=active]:border data-[state=active]:border-primary/30">
            <Moon className="h-4 w-4" />
            <span className="text-[9px] leading-tight hidden sm:inline">Ramazan</span>
          </TabsTrigger>
          <TabsTrigger value="zikirmatik" className="flex-col gap-1 px-0.5 py-2 h-auto data-[state=active]:bg-primary/20 data-[state=active]:border data-[state=active]:border-primary/30">
            <CircleDot className="h-4 w-4" />
            <span className="text-[9px] leading-tight hidden sm:inline">Zikir</span>
          </TabsTrigger>
          <div className="flex items-center justify-center">
            <TabsOverflowMenu onSelectTab={(tab) => onValueChange?.(tab)} />
          </div>
        </TabsList>
      </div>

      <TabsContent value="home" className="mt-4">
        {children.home}
      </TabsContent>

      <TabsContent value="settings" className="mt-4">
        {children.settings}
      </TabsContent>

      <TabsContent value="adhkar" className="mt-4">
        {children.adhkar}
      </TabsContent>

      <TabsContent value="duaguide" className="mt-4">
        {children.duaguide}
      </TabsContent>

      <TabsContent value="tasbihat" className="mt-4">
        {children.tasbihat}
      </TabsContent>

      <TabsContent value="esmaulhusna" className="mt-4">
        {children.esmaulhusna}
      </TabsContent>

      <TabsContent value="zikirmatik" className="mt-4">
        {children.zikirmatik}
      </TabsContent>

      <TabsContent value="hatim" className="mt-4">
        {children.hatim}
      </TabsContent>

      <TabsContent value="namazogretici" className="mt-4">
        {children.namazogretici}
      </TabsContent>

      <TabsContent value="qibla" className="mt-4">
        {children.qibla}
      </TabsContent>

      <TabsContent value="ramazan" className="mt-4">
        {children.ramazan}
      </TabsContent>

      <TabsContent value="religiousdays" className="mt-4">
        {children.religiousdays}
      </TabsContent>

      <TabsContent value="nearbymosque" className="mt-4">
        {children.nearbymosque}
      </TabsContent>

      <TabsContent value="fastingtracker" className="mt-4">
        {children.fastingtracker}
      </TabsContent>

      <TabsContent value="prayertracker" className="mt-4">
        {children.prayertracker}
      </TabsContent>

      <TabsContent value="quranreading" className="mt-4">
        {children.quranreading}
      </TabsContent>
    </Tabs>
  );
}
