import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '../settings/useAppSettings';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';

type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: 'Sabah',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı'
};

const PRAYER_ORDER: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function PrayerTrackerTab() {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const todayKey = getTodayDateKey();

  // Get today's checklist
  const dailyChecklists = settings.prayerDailyChecklists || {};
  const todayChecklist = dailyChecklists[todayKey] || {};

  // Get kaza counters
  const kazaCounters = settings.prayerKazaCounters || {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  };

  // Toggle daily prayer
  const toggleDailyPrayer = async (prayer: PrayerKey) => {
    const newChecklist = {
      ...todayChecklist,
      [prayer]: !todayChecklist[prayer]
    };

    await saveSettings({
      ...settings,
      prayerDailyChecklists: {
        ...dailyChecklists,
        [todayKey]: newChecklist
      }
    });
  };

  // Update kaza counter
  const updateKazaCounter = async (prayer: PrayerKey, delta: number) => {
    const currentCount = kazaCounters[prayer] || 0;
    const newCount = Math.max(0, currentCount + delta);

    await saveSettings({
      ...settings,
      prayerKazaCounters: {
        ...kazaCounters,
        [prayer]: newCount
      }
    });
  };

  // Set kaza counter directly
  const setKazaCounter = async (prayer: PrayerKey, value: number) => {
    const newCount = Math.max(0, value);

    await saveSettings({
      ...settings,
      prayerKazaCounters: {
        ...kazaCounters,
        [prayer]: newCount
      }
    });
  };

  // Calculate stats
  const todayCompleted = PRAYER_ORDER.filter(p => todayChecklist[p]).length;
  const totalKaza = PRAYER_ORDER.reduce((sum, p) => sum + (kazaCounters[p] || 0), 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Namaz Takibi</h2>
        <p className="text-sm text-muted-foreground">
          Günlük namazlarınızı ve kaza namazlarınızı takip edin
        </p>
      </div>

      {/* Daily Prayers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Günlük Namazlar</span>
            <span className="text-sm font-normal text-muted-foreground">
              {todayCompleted}/5 Tamamlandı
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRAYER_ORDER.map((prayer) => {
            const isCompleted = todayChecklist[prayer] || false;
            return (
              <div
                key={prayer}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`daily-${prayer}`}
                    checked={isCompleted}
                    onCheckedChange={() => toggleDailyPrayer(prayer)}
                    disabled={isSaving}
                  />
                  <Label
                    htmlFor={`daily-${prayer}`}
                    className={`text-base cursor-pointer ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {PRAYER_NAMES[prayer]}
                  </Label>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Kaza Prayers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Kaza Namazları</span>
            <span className="text-sm font-normal text-muted-foreground">
              Toplam: {totalKaza}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {PRAYER_ORDER.map((prayer) => {
            const count = kazaCounters[prayer] || 0;
            return (
              <div
                key={prayer}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <Label className="text-base font-medium">
                    {PRAYER_NAMES[prayer]}
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  {/* Decrement button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateKazaCounter(prayer, -1)}
                    disabled={count === 0 || isSaving}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  {/* Counter input */}
                  <Input
                    type="number"
                    min="0"
                    value={count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setKazaCounter(prayer, val);
                    }}
                    disabled={isSaving}
                    className="w-20 text-center"
                  />

                  {/* Increment button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateKazaCounter(prayer, 1)}
                    disabled={isSaving}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="pt-2 text-xs text-muted-foreground text-center">
            Kaza namazlarınızı kıldıkça sayıyı azaltın
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>
          © {new Date().getFullYear()} · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'hadi-namaza'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
