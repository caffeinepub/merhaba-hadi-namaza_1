import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Clock } from 'lucide-react';

interface NextPrayerCountdownProps {
  nextPrayer: { name: string; time: string } | null;
  timeRemaining: string;
  isLoading: boolean;
  error: any;
}

/**
 * Presentational component displaying next prayer countdown with seconds-inclusive time remaining.
 * 
 * Receives computed nextPrayer and timeRemaining (mm:ss or HH:mm:ss format) from parent (HomeTab)
 * to ensure single source of truth and prevent duplicate bridge sends.
 */
export function NextPrayerCountdown({ nextPrayer, timeRemaining, isLoading, error }: NextPrayerCountdownProps) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/30">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !nextPrayer) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/30 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Sıradaki Vakit</p>
              <p className="text-xl font-bold">{nextPrayer.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{nextPrayer.time}</p>
            <p className="text-sm text-muted-foreground font-medium tabular-nums">{timeRemaining}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

