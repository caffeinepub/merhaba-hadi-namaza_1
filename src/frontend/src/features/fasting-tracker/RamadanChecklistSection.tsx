import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Moon, RotateCcw } from 'lucide-react';
import type { RamadanDayStatus } from '../settings/appSettingsModel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RamadanChecklistSectionProps {
  dayStatuses: RamadanDayStatus[];
  onSetDayStatus: (dayIndex: number, status: RamadanDayStatus) => void;
  onReset: () => void;
}

export function RamadanChecklistSection({
  dayStatuses,
  onSetDayStatus,
  onReset,
}: RamadanChecklistSectionProps) {
  const fastedCount = dayStatuses.filter(status => status === 'Fasted').length;
  const missedCount = dayStatuses.filter(status => status === 'Missed').length;
  const progressPercentage = (fastedCount / 30) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Ramazan Ayı Takibi
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Sıfırla
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent aria-describedby="reset-description">
              <AlertDialogHeader>
                <AlertDialogTitle>Ramazan takibini sıfırla?</AlertDialogTitle>
                <AlertDialogDescription id="reset-description">
                  Tüm günler "Tuttu" olarak işaretlenecek. Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>Sıfırla</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tutulan Oruçlar</span>
            <Badge variant="secondary" className="text-base font-semibold">
              {fastedCount} / 30
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Separator />

        {/* 30 Days Grid */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Günler</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 30 }, (_, i) => i).map((dayIndex) => {
              const status = dayStatuses[dayIndex] || 'Fasted';
              const isFasted = status === 'Fasted';
              
              return (
                <div
                  key={dayIndex}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors min-w-0"
                >
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    Gün {dayIndex + 1}
                  </span>
                  <div className="flex flex-col gap-1 w-full min-w-0">
                    <Button
                      size="sm"
                      variant={isFasted ? 'default' : 'outline'}
                      className="w-full h-7 text-[10px] px-1 min-w-0"
                      onClick={() => onSetDayStatus(dayIndex, 'Fasted')}
                    >
                      Tuttu
                    </Button>
                    <Button
                      size="sm"
                      variant={!isFasted ? 'destructive' : 'outline'}
                      className="w-full h-7 text-[10px] px-1 min-w-0"
                      onClick={() => onSetDayStatus(dayIndex, 'Missed')}
                    >
                      Tutmadı
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Make-up Fasts Summary */}
        <Separator />
        <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
          <span className="text-sm font-medium">Kaza Orucu Gerekli:</span>
          <Badge variant="destructive" className="text-lg font-bold">
            {missedCount}
          </Badge>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Her gün için "Tuttu" veya "Tutmadı" seçeneğini işaretleyin. Tutulmayan günler otomatik olarak kaza orucu sayısına eklenir.
        </p>
      </CardContent>
    </Card>
  );
}
