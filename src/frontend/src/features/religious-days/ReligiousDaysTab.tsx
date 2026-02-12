// Dini Günler tab component displaying full 2026 yearly list with next-up highlight in Turkish

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useReligiousDaysForYear } from './useReligiousDaysForYear';

export function ReligiousDaysTab() {
  const { allDays, nextUpcoming, daysRemaining } = useReligiousDaysForYear();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Dini Günler</h2>
        <p className="text-sm text-muted-foreground">
          2026 yılı önemli İslami günler
        </p>
      </div>

      {/* Next Upcoming Card */}
      {nextUpcoming && daysRemaining !== null ? (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Yaklaşan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{nextUpcoming.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4" />
                {nextUpcoming.displayDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-base px-3 py-1">
                {daysRemaining === 0 ? 'Bugün' : `${daysRemaining} gün kaldı`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-muted">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Bu yıl için yaklaşan dini gün bulunmamaktadır.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Full List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Tüm Dini Günler 2026</h3>
        <div className="space-y-2">
          {allDays.map((day) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            const isPast = dayDate < today;
            const isNext = nextUpcoming?.id === day.id;
            
            return (
              <Card 
                key={day.id} 
                className={`${isNext ? 'border-primary/50 bg-primary/5' : ''} ${isPast ? 'opacity-60' : ''}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{day.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {day.displayDate}
                      </p>
                    </div>
                    {isNext && (
                      <Badge variant="outline" className="shrink-0">
                        Sıradaki
                      </Badge>
                    )}
                    {isPast && (
                      <Badge variant="secondary" className="shrink-0">
                        Geçmiş
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
