import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import type { DailyPrayerTimes } from '../prayer/aladhanWeeklyApi';

interface WeeklyPrayerTimesSectionProps {
  weeklyData: DailyPrayerTimes[];
  isLoading: boolean;
  error: Error | null;
}

export function WeeklyPrayerTimesSection({ weeklyData, isLoading, error }: WeeklyPrayerTimesSectionProps) {
  if (isLoading) {
    return (
      <Card className="border-2 shadow-soft">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-lg">Haftalık Namaz Vakitleri</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 shadow-soft">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-lg">Haftalık Namaz Vakitleri</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive text-center py-4">Haftalık namaz vakitleri alınamadı</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-soft overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <CardTitle className="text-lg">Haftalık Namaz Vakitleri</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 hover:bg-transparent">
                <TableHead className="font-semibold bg-muted/30 sticky left-0 z-10">Gün</TableHead>
                <TableHead className="text-center font-semibold prayer-imsak-col border-l">İmsak</TableHead>
                <TableHead className="text-center font-semibold prayer-gunes-col border-l">Güneş</TableHead>
                <TableHead className="text-center font-semibold prayer-ogle-col border-l">Öğle</TableHead>
                <TableHead className="text-center font-semibold prayer-ikindi-col border-l">İkindi</TableHead>
                <TableHead className="text-center font-semibold prayer-aksam-col border-l">Akşam</TableHead>
                <TableHead className="text-center font-semibold prayer-yatsi-col border-l">Yatsı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyData.map((day, index) => {
                const isToday = index === 0;
                return (
                  <TableRow 
                    key={index} 
                    className={`
                      border-b transition-colors
                      ${isToday ? 'bg-primary/10 hover:bg-primary/15 font-medium' : 'hover:bg-muted/20'}
                    `}
                  >
                    <TableCell className="font-medium whitespace-nowrap bg-muted/20 sticky left-0 z-10">
                      {day.dayLabel}
                      {isToday && <span className="ml-2 text-xs text-primary">(Bugün)</span>}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-imsak-col border-l">
                      {day.fajr}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-gunes-col border-l">
                      {day.sunrise}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-ogle-col border-l">
                      {day.dhuhr}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-ikindi-col border-l">
                      {day.asr}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-aksam-col border-l">
                      {day.maghrib}
                    </TableCell>
                    <TableCell className="text-center tabular-nums prayer-yatsi-col border-l">
                      {day.isha}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
