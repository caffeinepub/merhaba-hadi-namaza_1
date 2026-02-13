import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BookOpen, Play, Pause, SkipBack, SkipForward, ChevronLeft, Languages, Volume2 } from 'lucide-react';
import { getAllSurahs, getSurahContent, type SurahMetadata, type SurahContent } from './quranApi';
import { useAyahAudioPlayer } from './useAyahAudioPlayer';
import { useQuranReadingState } from './useQuranReadingState';

type ViewMode = 'list' | 'reader';

export function QuranOgreniyorumTab() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [surahs, setSurahs] = useState<SurahMetadata[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { readingState, saveReadingState } = useQuranReadingState();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio player
  const audioUrls = selectedSurah?.ayahs.map((a) => a.audio || '') || [];
  const [audioState, audioControls] = useAyahAudioPlayer({
    audioUrls,
    initialIndex: 0,
    autoPlayNext: true
  });

  // Load all surahs on mount
  useEffect(() => {
    getAllSurahs().then((data) => {
      setSurahs(data);
      setIsLoadingSurahs(false);
    });
  }, []);

  // Restore last reading position
  useEffect(() => {
    if (surahs.length > 0 && readingState.lastSurahNumber > 0) {
      handleSelectSurah(readingState.lastSurahNumber);
    }
  }, [surahs.length]);

  // Restore scroll position after content loads
  useEffect(() => {
    if (selectedSurah && scrollRef.current && readingState.scrollPosition > 0) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = readingState.scrollPosition;
        }
      }, 100);
    }
  }, [selectedSurah]);

  const handleSelectSurah = async (surahNumber: number) => {
    // Stop any playing audio from previous surah
    audioControls.pause();
    
    setIsLoadingContent(true);
    setError(null);

    const content = await getSurahContent(surahNumber);

    if (content) {
      setSelectedSurah(content);
      setViewMode('reader');
      saveReadingState({ lastSurahNumber: surahNumber, lastAyahNumber: 1 });
      
      // Reset audio to first ayah of new surah
      audioControls.setAyahIndex(0);
    } else {
      setError('Sure yüklenemedi. Lütfen tekrar deneyin.');
    }

    setIsLoadingContent(false);
  };

  const handleBackToList = () => {
    // Save scroll position before leaving
    if (scrollRef.current) {
      saveReadingState({ scrollPosition: scrollRef.current.scrollTop });
    }
    
    // Stop audio and reset
    audioControls.pause();
    audioControls.setAyahIndex(0);
    
    setViewMode('list');
    setSelectedSurah(null);
  };

  const handleScroll = () => {
    if (scrollRef.current && selectedSurah) {
      saveReadingState({ scrollPosition: scrollRef.current.scrollTop });
    }
  };

  if (isLoadingSurahs) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Kur'an-ı Kerim Okuma</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  114 Sure • Sesli Okuma • Meal
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {surahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => handleSelectSurah(surah.number)}
                    className="w-full text-left p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                          {surah.number}
                        </div>
                        <div>
                          <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {surah.englishName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayet
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-arabic mb-1">{surah.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {surah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reader view
  if (isLoadingContent) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-destructive/20">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={handleBackToList} variant="outline">
                Sure Listesine Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedSurah) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header with back button and controls */}
      <Card className="border-2 border-primary/20 bg-card/90 backdrop-blur-sm sticky top-0 z-10">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Sure Listesi
            </Button>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="translation-toggle"
                checked={showTranslation}
                onCheckedChange={setShowTranslation}
              />
              <Label htmlFor="translation-toggle" className="text-sm cursor-pointer">
                Meal
              </Label>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-3xl font-arabic mb-2">{selectedSurah.metadata.name}</h2>
            <h3 className="text-xl font-semibold mb-1">
              {selectedSurah.metadata.englishName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedSurah.metadata.englishNameTranslation} • {selectedSurah.metadata.numberOfAyahs} Ayet •{' '}
              {selectedSurah.metadata.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
            </p>
          </div>

          {/* Audio controls */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Ayet {audioState.currentAyahIndex + 1} / {selectedSurah.ayahs.length}
              </span>
              {audioState.error && (
                <span className="text-xs text-destructive font-medium px-2 py-1 bg-destructive/10 rounded">
                  {audioState.error}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={audioControls.previousAyah}
                disabled={audioState.currentAyahIndex === 0 || audioState.isLoading}
                className="h-10 w-10"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={audioControls.togglePlayPause}
                disabled={audioState.isLoading || !!audioState.error}
                className="h-14 w-14"
              >
                {audioState.isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : audioState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={audioControls.nextAyah}
                disabled={
                  audioState.currentAyahIndex === selectedSurah.ayahs.length - 1 ||
                  audioState.isLoading
                }
                className="h-10 w-10"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ayahs content */}
      <Card className="border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
        <CardContent className="pt-6">
          <ScrollArea className="h-[500px] pr-4" ref={scrollRef} onScroll={handleScroll}>
            <div className="space-y-6">
              {selectedSurah.ayahs.map((ayah, index) => (
                <div
                  key={ayah.number}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    audioState.currentAyahIndex === index
                      ? 'border-primary/40 bg-primary/5 shadow-sm'
                      : 'border-primary/10 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {ayah.numberInSurah}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => audioControls.selectAndPlay(index)}
                      disabled={audioState.isLoading}
                      className="gap-2 h-8"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span className="text-xs">Dinle</span>
                    </Button>
                  </div>

                  <div className="text-right mb-4">
                    <p className="text-2xl leading-loose font-arabic">{ayah.text}</p>
                  </div>

                  {showTranslation && ayah.translation && (
                    <div className="pt-3 border-t border-primary/10">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ayah.translation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
