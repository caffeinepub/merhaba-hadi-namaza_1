import React, { useState } from 'react';
import { useAppSettings } from '../settings/useAppSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RamadanChecklistSection } from './RamadanChecklistSection';
import type { RamadanDayStatus } from '../settings/appSettingsModel';

export function FastingTrackerTab() {
  const { settings, saveSettings } = useAppSettings();
  const [voluntaryDate, setVoluntaryDate] = useState('');
  const [makeUpDate, setMakeUpDate] = useState('');
  const [makeUpTarget, setMakeUpTarget] = useState(settings.fastingMakeUpTargetCount?.toString() || '0');
  const [errorMessage, setErrorMessage] = useState('');

  const voluntaryDates = settings.fastingVoluntaryDates || [];
  const makeUpDates = settings.fastingMakeUpDates || [];
  const makeUpTargetCount = settings.fastingMakeUpTargetCount || 0;
  const ramadanDayStatuses = settings.ramadanDayStatuses || Array(30).fill('Fasted' as RamadanDayStatus);

  // Calculate missed Ramadan days (automatic make-up total)
  const missedRamadanTotal = ramadanDayStatuses.filter(status => status === 'Missed').length;

  // Sort dates descending (newest first)
  const sortedVoluntaryDates = [...voluntaryDates].sort((a, b) => b.localeCompare(a));
  const sortedMakeUpDates = [...makeUpDates].sort((a, b) => b.localeCompare(a));

  // Calculate remaining make-up fasts (from manual tracking)
  const remainingMakeUp = Math.max(makeUpTargetCount - makeUpDates.length, 0);

  const handleAddVoluntary = async () => {
    if (!voluntaryDate) return;

    if (voluntaryDates.includes(voluntaryDate)) {
      setErrorMessage('Bu tarih zaten nafile oruç olarak kaydedilmiş.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    await saveSettings({
      ...settings,
      fastingVoluntaryDates: [...voluntaryDates, voluntaryDate]
    });
    setVoluntaryDate('');
    setErrorMessage('');
  };

  const handleRemoveVoluntary = async (date: string) => {
    await saveSettings({
      ...settings,
      fastingVoluntaryDates: voluntaryDates.filter(d => d !== date)
    });
  };

  const handleAddMakeUp = async () => {
    if (!makeUpDate) return;

    if (makeUpDates.includes(makeUpDate)) {
      setErrorMessage('Bu tarih zaten kaza orucu olarak kaydedilmiş.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    await saveSettings({
      ...settings,
      fastingMakeUpDates: [...makeUpDates, makeUpDate]
    });
    setMakeUpDate('');
    setErrorMessage('');
  };

  const handleRemoveMakeUp = async (date: string) => {
    await saveSettings({
      ...settings,
      fastingMakeUpDates: makeUpDates.filter(d => d !== date)
    });
  };

  const handleUpdateTarget = async () => {
    const targetValue = parseInt(makeUpTarget, 10);
    if (isNaN(targetValue) || targetValue < 0) return;

    await saveSettings({
      ...settings,
      fastingMakeUpTargetCount: targetValue
    });
  };

  const handleSetRamadanDayStatus = async (dayIndex: number, status: RamadanDayStatus) => {
    const newStatuses = [...ramadanDayStatuses];
    newStatuses[dayIndex] = status;
    
    await saveSettings({
      ...settings,
      ramadanDayStatuses: newStatuses
    });
  };

  const handleResetRamadan = async () => {
    await saveSettings({
      ...settings,
      ramadanDayStatuses: Array(30).fill('Fasted' as RamadanDayStatus)
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Oruç Takibi</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ramazan, nafile ve kaza oruçlarınızı takip edin
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Ramadan Checklist Section */}
      <RamadanChecklistSection
        dayStatuses={ramadanDayStatuses}
        onSetDayStatus={handleSetRamadanDayStatus}
        onReset={handleResetRamadan}
      />

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Özet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nafile Oruçlar:</span>
            <Badge variant="secondary" className="text-base font-semibold">
              {voluntaryDates.length}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ramazan Kaza Orucu:</span>
            <Badge variant="destructive" className="text-base font-semibold">
              {missedRamadanTotal}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tamamlanan Kaza Oruçları:</span>
            <Badge variant="secondary" className="text-base font-semibold">
              {makeUpDates.length}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Kalan Kaza Oruçları:</span>
            <Badge variant="default" className="text-base font-semibold">
              {remainingMakeUp}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Voluntary Fasts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nafile Oruçlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Voluntary Fast */}
          <div className="space-y-2">
            <Label htmlFor="voluntary-date">Nafile Oruç Tarihi Ekle</Label>
            <div className="flex gap-2">
              <Input
                id="voluntary-date"
                type="date"
                value={voluntaryDate}
                onChange={(e) => setVoluntaryDate(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddVoluntary} size="icon" disabled={!voluntaryDate}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Voluntary Fasts List */}
          <div className="space-y-2">
            <Label>Takip Edilen Tarihler ({voluntaryDates.length})</Label>
            {sortedVoluntaryDates.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Henüz nafile oruç kaydedilmedi. Yukarıdan ilk tarihinizi ekleyin.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedVoluntaryDates.map((date) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm font-medium">
                      {new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVoluntary(date)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Make-up Fasts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Kaza Oruçları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Set Target */}
          <div className="space-y-2">
            <Label htmlFor="makeup-target">Hedef Kaza Orucu Sayısı</Label>
            <div className="flex gap-2">
              <Input
                id="makeup-target"
                type="number"
                min="0"
                value={makeUpTarget}
                onChange={(e) => setMakeUpTarget(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUpdateTarget}>
                Güncelle
              </Button>
            </div>
          </div>

          <Separator />

          {/* Add Make-up Fast */}
          <div className="space-y-2">
            <Label htmlFor="makeup-date">Kaza Orucu Tarihi Ekle</Label>
            <div className="flex gap-2">
              <Input
                id="makeup-date"
                type="date"
                value={makeUpDate}
                onChange={(e) => setMakeUpDate(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddMakeUp} size="icon" disabled={!makeUpDate}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Make-up Fasts List */}
          <div className="space-y-2">
            <Label>Tamamlanan Tarihler ({makeUpDates.length})</Label>
            {sortedMakeUpDates.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Henüz kaza orucu kaydedilmedi. Yukarıdan ilk tarihinizi ekleyin.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedMakeUpDates.map((date) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm font-medium">
                      {new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMakeUp(date)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
