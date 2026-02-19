import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Target } from 'lucide-react';
import { useAppSettings } from '../settings/useAppSettings';

export function ZikirmatikTab() {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [count, setCount] = useState(settings.zikirmatikCount || 0);
  const [target, setTarget] = useState(settings.zikirmatikTarget || 33);
  const [tempTarget, setTempTarget] = useState(String(target));

  // Sync local state with settings when they load
  useEffect(() => {
    setCount(settings.zikirmatikCount || 0);
    setTarget(settings.zikirmatikTarget || 33);
    setTempTarget(String(settings.zikirmatikTarget || 33));
  }, [settings.zikirmatikCount, settings.zikirmatikTarget]);

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await saveSettings({
      ...settings,
      zikirmatikCount: newCount
    });
  };

  const handleReset = async () => {
    setCount(0);
    await saveSettings({
      ...settings,
      zikirmatikCount: 0
    });
  };

  const handleTargetChange = (value: string) => {
    setTempTarget(value);
  };

  const handleTargetBlur = async () => {
    const numValue = parseInt(tempTarget, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setTarget(numValue);
      await saveSettings({
        ...settings,
        zikirmatikTarget: numValue
      });
    } else {
      setTempTarget(String(target));
    }
  };

  const handleTargetKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  const remaining = Math.max(target - count, 0);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-center text-xl sm:text-2xl">Dijital Tesbih</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Counter Display */}
          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary tabular-nums">
              {count}
            </div>
            <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
              {remaining > 0 ? `${remaining} kez daha` : 'Hedefe ulaştınız! 🎉'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 sm:h-3" />
          </div>

          {/* Target Setting */}
          <div className="space-y-2">
            <Label htmlFor="target" className="flex items-center gap-2 text-sm sm:text-base">
              <Target className="h-4 w-4" />
              Hedef Sayı
            </Label>
            <Input
              id="target"
              type="number"
              min="1"
              value={tempTarget}
              onChange={(e) => handleTargetChange(e.target.value)}
              onBlur={handleTargetBlur}
              onKeyDown={handleTargetKeyDown}
              className="text-base sm:text-lg h-11 sm:h-12"
              disabled={isSaving}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={isSaving || count === 0}
              className="h-12 sm:h-14 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
            >
              <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Sıfırla
            </Button>
            <Button
              size="lg"
              onClick={handleIncrement}
              disabled={isSaving}
              className="h-12 sm:h-14 text-base sm:text-lg font-semibold min-h-[44px] sm:min-h-[48px]"
            >
              +1
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Target Buttons */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Hızlı Hedef Seçimi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[33, 99, 100, 500, 1000, 10000].map((value) => (
              <Button
                key={value}
                variant={target === value ? 'default' : 'outline'}
                onClick={async () => {
                  setTarget(value);
                  setTempTarget(String(value));
                  await saveSettings({
                    ...settings,
                    zikirmatikTarget: value
                  });
                }}
                disabled={isSaving}
                className="h-10 sm:h-12 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
              >
                {value}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            Tesbih çekerken kalp huzuru ve konsantrasyonunuzu koruyun. 
            Her zikir, Allah'a yakınlaşmanın bir adımıdır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
