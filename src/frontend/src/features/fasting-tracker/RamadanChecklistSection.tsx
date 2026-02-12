import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Moon, RotateCcw } from 'lucide-react';
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
  completedDays: boolean[];
  onToggleDay: (dayIndex: number) => void;
  onReset: () => void;
}

export function RamadanChecklistSection({
  completedDays,
  onToggleDay,
  onReset,
}: RamadanChecklistSectionProps) {
  const completedCount = completedDays.filter(Boolean).length;
  const progressPercentage = (completedCount / 30) * 100;

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
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ramazan takibini sıfırla?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tüm işaretli günler temizlenecek. Bu işlem geri alınamaz.
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
            <span className="text-sm font-medium">İlerleme</span>
            <Badge variant="secondary" className="text-base font-semibold">
              {completedCount} / 30
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Separator />

        {/* 30 Days Grid */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Günler</span>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i).map((dayIndex) => (
              <div
                key={dayIndex}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {dayIndex + 1}
                </span>
                <Checkbox
                  checked={completedDays[dayIndex] || false}
                  onCheckedChange={() => onToggleDay(dayIndex)}
                  className="h-5 w-5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Ramazan ayında tuttuğunuz oruçları işaretleyerek takip edin
        </p>
      </CardContent>
    </Card>
  );
}
