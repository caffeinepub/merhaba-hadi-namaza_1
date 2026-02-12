import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, BookOpen, Plus, Minus } from 'lucide-react';
import { useAppSettings } from '../settings/useAppSettings';

const TOTAL_PAGES = 604;

export function HatimTakipTab() {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [currentPage, setCurrentPage] = useState(settings.hatimLastReadPage || 1);
  const [tempPage, setTempPage] = useState(String(settings.hatimLastReadPage || 1));

  // Sync local state with settings when they load
  useEffect(() => {
    setCurrentPage(settings.hatimLastReadPage || 1);
    setTempPage(String(settings.hatimLastReadPage || 1));
  }, [settings.hatimLastReadPage]);

  const handlePageChange = (value: string) => {
    setTempPage(value);
  };

  const handlePageBlur = async () => {
    const numValue = parseInt(tempPage, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= TOTAL_PAGES) {
      setCurrentPage(numValue);
      await saveSettings({
        ...settings,
        hatimLastReadPage: numValue
      });
    } else {
      setTempPage(String(currentPage));
    }
  };

  const handlePageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleIncrement = async () => {
    const newPage = Math.min(currentPage + 1, TOTAL_PAGES);
    setCurrentPage(newPage);
    setTempPage(String(newPage));
    await saveSettings({
      ...settings,
      hatimLastReadPage: newPage
    });
  };

  const handleDecrement = async () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    setTempPage(String(newPage));
    await saveSettings({
      ...settings,
      hatimLastReadPage: newPage
    });
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setTempPage('1');
    await saveSettings({
      ...settings,
      hatimLastReadPage: 1
    });
  };

  const progress = (currentPage / TOTAL_PAGES) * 100;
  const remainingPages = TOTAL_PAGES - currentPage;

  return (
    <div className="space-y-6 pb-20">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6" />
            Hatim Takip
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Page Display */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-sm text-muted-foreground mb-2">
              Okuduğunuz Sayfa
            </div>
            <div className="text-7xl font-bold text-primary tabular-nums">
              {currentPage}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              / {TOTAL_PAGES} sayfa
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {remainingPages > 0 ? `${remainingPages} sayfa kaldı` : 'Hatmi tamamladınız! 🎉'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Page Input */}
          <div className="space-y-2">
            <Label htmlFor="page" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sayfa Numarası (1-{TOTAL_PAGES})
            </Label>
            <Input
              id="page"
              type="number"
              min="1"
              max={TOTAL_PAGES}
              value={tempPage}
              onChange={(e) => handlePageChange(e.target.value)}
              onBlur={handlePageBlur}
              onKeyDown={handlePageKeyDown}
              className="text-lg"
              disabled={isSaving}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDecrement}
              disabled={isSaving || currentPage <= 1}
              className="h-14"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={isSaving || currentPage === 1}
              className="h-14"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={handleIncrement}
              disabled={isSaving || currentPage >= TOTAL_PAGES}
              className="h-14"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Juz Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cüz İlerlemesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mevcut Cüz</span>
              <span className="font-medium text-lg">
                {Math.ceil(currentPage / 20)}. Cüz
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cüz İçi Sayfa</span>
              <span className="font-medium">
                {((currentPage - 1) % 20) + 1} / 20
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Kur'an-ı Kerim'i düzenli okumak, kalp huzuru ve manevi gelişim için önemlidir. 
            Her gün birkaç sayfa okuyarak hatmi tamamlayabilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
