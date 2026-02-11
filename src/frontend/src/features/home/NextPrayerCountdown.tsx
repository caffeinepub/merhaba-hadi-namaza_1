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
      <Card className="bg-primary/10 border-primary">
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
    <Card className="bg-primary/10 border-primary">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sıradaki Vakit</p>
              <p className="text-xl font-bold">{nextPrayer.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{nextPrayer.time}</p>
            <p className="text-sm text-muted-foreground">{timeRemaining}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
