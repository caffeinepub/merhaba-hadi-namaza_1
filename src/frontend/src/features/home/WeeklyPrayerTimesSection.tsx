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
      <Card className="border-2">
        <CardHeader>
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
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Haftalık Namaz Vakitleri</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive text-center py-4">Haftalık namaz vakitleri alınamadı</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg">Haftalık Namaz Vakitleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Gün</TableHead>
                <TableHead className="text-center font-semibold">İmsak</TableHead>
                <TableHead className="text-center font-semibold">Güneş</TableHead>
                <TableHead className="text-center font-semibold">Öğle</TableHead>
                <TableHead className="text-center font-semibold">İkindi</TableHead>
                <TableHead className="text-center font-semibold">Akşam</TableHead>
                <TableHead className="text-center font-semibold">Yatsı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyData.map((day, index) => (
                <TableRow key={index} className={index === 0 ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {day.dayLabel}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{day.fajr}</TableCell>
                  <TableCell className="text-center tabular-nums">{day.sunrise}</TableCell>
                  <TableCell className="text-center tabular-nums">{day.dhuhr}</TableCell>
                  <TableCell className="text-center tabular-nums">{day.asr}</TableCell>
                  <TableCell className="text-center tabular-nums">{day.maghrib}</TableCell>
                  <TableCell className="text-center tabular-nums">{day.isha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
