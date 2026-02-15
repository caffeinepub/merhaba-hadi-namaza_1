import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Clock, Moon, Sunset } from 'lucide-react';
import { useSahurIftarCountdown } from './useSahurIftarCountdown';

interface SahurIftarStripProps {
  adjustedTimes: { fajr: string; maghrib: string } | null;
  isLoading: boolean;
  error: any;
}

export function SahurIftarStrip({ adjustedTimes, isLoading, error }: SahurIftarStripProps) {
  const countdown = useSahurIftarCountdown(adjustedTimes);

  // Hide if loading, error, or no data
  if (isLoading || error || !countdown) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/30">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Left: Sahur time */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-accent/20">
              <Moon className="h-5 w-5 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">Sahur</p>
              <p className="text-lg font-bold tabular-nums">{countdown.sahurTime}</p>
            </div>
          </div>

          {/* Center: Countdown */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">Kalan süre</p>
              <p className="text-base font-bold">{countdown.targetLabel}</p>
              <p className="text-lg font-bold tabular-nums text-primary">{countdown.timeRemaining}</p>
            </div>
          </div>

          {/* Right: Iftar time */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-accent/20">
              <Sunset className="h-5 w-5 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">Iftar</p>
              <p className="text-lg font-bold tabular-nums">{countdown.iftarTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
