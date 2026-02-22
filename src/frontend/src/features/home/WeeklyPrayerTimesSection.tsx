import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import type { DailyPrayerTimes } from '../prayer/aladhanWeeklyApi';

interface WeeklyPrayerTimesSectionProps {
  weeklyData: DailyPrayerTimes[];
  isLoading: boolean;
  error: Error | null;
}

export function WeeklyPrayerTimesSection({ weeklyData, isLoading, error }: WeeklyPrayerTimesSectionProps) {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Haftalık Namaz Vakitleri
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              Haftalık namaz vakitleri alınamadı. Lütfen daha sonra tekrar deneyin.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && weeklyData.length > 0 && (
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th
                        scope="col"
                        className="sticky left-0 z-10 bg-muted/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-r-2 border-border shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
                      >
                        Gün
                      </th>
                      <th scope="col" className="weekly-prayer-col-imsak px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        İmsak
                      </th>
                      <th scope="col" className="weekly-prayer-col-gunes px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        Güneş
                      </th>
                      <th scope="col" className="weekly-prayer-col-ogle px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        Öğle
                      </th>
                      <th scope="col" className="weekly-prayer-col-ikindi px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        İkindi
                      </th>
                      <th scope="col" className="weekly-prayer-col-aksam px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        Akşam
                      </th>
                      <th scope="col" className="weekly-prayer-col-yatsi px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                        Yatsı
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {weeklyData.map((day, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="sticky left-0 z-10 bg-background/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-r-2 border-border shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                          {day.dayLabel}
                        </td>
                        <td className="weekly-prayer-col-imsak px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.fajr}
                        </td>
                        <td className="weekly-prayer-col-gunes px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.sunrise}
                        </td>
                        <td className="weekly-prayer-col-ogle px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.dhuhr}
                        </td>
                        <td className="weekly-prayer-col-ikindi px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.asr}
                        </td>
                        <td className="weekly-prayer-col-aksam px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.maghrib}
                        </td>
                        <td className="weekly-prayer-col-yatsi px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm tabular-nums">
                          {day.isha}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && weeklyData.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Haftalık namaz vakitleri yükleniyor...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
