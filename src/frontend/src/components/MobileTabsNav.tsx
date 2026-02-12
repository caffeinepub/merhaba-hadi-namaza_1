import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Home, Settings, BookOpen, CircleDot, BookMarked, Scroll } from 'lucide-react';

interface MobileTabsNavProps {
  children: {
    home: React.ReactNode;
    settings: React.ReactNode;
    esmaulhusna: React.ReactNode;
    zikirmatik: React.ReactNode;
    namazogretici: React.ReactNode;
    cumahutbesi: React.ReactNode;
  };
  defaultTab?: string;
}

export function MobileTabsNav({ children, defaultTab = 'home' }: MobileTabsNavProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 gap-1">
        <TabsTrigger value="home" className="gap-1 px-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Ana Sayfa</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-1 px-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Ayarlar</span>
        </TabsTrigger>
        <TabsTrigger value="esmaulhusna" className="gap-1 px-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Esmaül Hüsna</span>
        </TabsTrigger>
        <TabsTrigger value="zikirmatik" className="gap-1 px-2">
          <CircleDot className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Zikirmatik</span>
        </TabsTrigger>
        <TabsTrigger value="namazogretici" className="gap-1 px-2">
          <BookMarked className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Öğretici</span>
        </TabsTrigger>
        <TabsTrigger value="cumahutbesi" className="gap-1 px-2">
          <Scroll className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Cuma Hutbesi</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="mt-4">
        {children.home}
      </TabsContent>

      <TabsContent value="settings" className="mt-4">
        {children.settings}
      </TabsContent>

      <TabsContent value="esmaulhusna" className="mt-4">
        {children.esmaulhusna}
      </TabsContent>

      <TabsContent value="zikirmatik" className="mt-4">
        {children.zikirmatik}
      </TabsContent>

      <TabsContent value="namazogretici" className="mt-4">
        {children.namazogretici}
      </TabsContent>

      <TabsContent value="cumahutbesi" className="mt-4">
        {children.cumahutbesi}
      </TabsContent>
    </Tabs>
  );
}
