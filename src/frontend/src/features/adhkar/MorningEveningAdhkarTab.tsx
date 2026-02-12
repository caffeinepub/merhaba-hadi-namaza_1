import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Sun, Moon } from 'lucide-react';
import { morningAdhkar, eveningAdhkar, type AdhkarItem } from './adhkarData';
import { useAppSettings } from '../settings/useAppSettings';

export function MorningEveningAdhkarTab() {
  const { settings, saveSettings } = useAppSettings();

  const morningCompleted = settings.adhkarMorningCompleted || {};
  const eveningCompleted = settings.adhkarEveningCompleted || {};

  const handleToggle = async (id: string, isMorning: boolean) => {
    if (isMorning) {
      const newCompleted = { ...morningCompleted, [id]: !morningCompleted[id] };
      await saveSettings({ ...settings, adhkarMorningCompleted: newCompleted });
    } else {
      const newCompleted = { ...eveningCompleted, [id]: !eveningCompleted[id] };
      await saveSettings({ ...settings, adhkarEveningCompleted: newCompleted });
    }
  };

  const handleResetMorning = async () => {
    await saveSettings({ ...settings, adhkarMorningCompleted: {} });
  };

  const handleResetEvening = async () => {
    await saveSettings({ ...settings, adhkarEveningCompleted: {} });
  };

  const handleResetAll = async () => {
    await saveSettings({ ...settings, adhkarMorningCompleted: {}, adhkarEveningCompleted: {} });
  };

  const renderAdhkarList = (items: AdhkarItem[], completed: Record<string, boolean>, isMorning: boolean) => {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className={completed[item.id] ? 'bg-muted/50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={completed[item.id] || false}
                  onCheckedChange={() => handleToggle(item.id, isMorning)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {item.count}x
                    </span>
                  </div>
                  {item.arabic && (
                    <p className="text-right text-lg leading-relaxed font-arabic" dir="rtl">
                      {item.arabic}
                    </p>
                  )}
                  {item.transliteration && (
                    <p className="text-xs text-muted-foreground italic">{item.transliteration}</p>
                  )}
                  {item.translation && (
                    <p className="text-sm text-foreground/80">{item.translation}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const morningCompletedCount = Object.values(morningCompleted).filter(Boolean).length;
  const eveningCompletedCount = Object.values(eveningCompleted).filter(Boolean).length;

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 pb-6">
        {/* Header with reset buttons */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sabah & Akşam Zikirleri</h2>
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Tümünü Sıfırla
          </Button>
        </div>

        {/* Morning Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h3 className="text-xl font-semibold">Sabah Zikirleri</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {morningCompletedCount}/{morningAdhkar.length}
              </span>
              <Button variant="ghost" size="sm" onClick={handleResetMorning}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {renderAdhkarList(morningAdhkar, morningCompleted, true)}
        </div>

        <Separator className="my-6" />

        {/* Evening Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-500" />
              <h3 className="text-xl font-semibold">Akşam Zikirleri</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {eveningCompletedCount}/{eveningAdhkar.length}
              </span>
              <Button variant="ghost" size="sm" onClick={handleResetEvening}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {renderAdhkarList(eveningAdhkar, eveningCompleted, false)}
        </div>
      </div>
    </ScrollArea>
  );
}
