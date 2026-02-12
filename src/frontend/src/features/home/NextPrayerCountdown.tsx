import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Clock } from 'lucide-react';
import { useNextPrayerCountdown } from './useNextPrayerCountdown';

interface NextPrayerCountdownProps {
  adjustedTimes: any;
  isLoading: boolean;
  error: any;
}

export function NextPrayerCountdown({ adjustedTimes, isLoading, error }: NextPrayerCountdownProps) {
  const { nextPrayer, timeRemaining } = useNextPrayerCountdown(adjustedTimes);

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
            <p className="text-sm text-muted-foreground font-medium">{timeRemaining}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
