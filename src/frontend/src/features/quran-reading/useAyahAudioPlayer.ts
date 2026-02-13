import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  currentAyahIndex: number;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  nextAyah: () => void;
  previousAyah: () => void;
  seekTo: (time: number) => void;
  setAyahIndex: (index: number) => void;
  selectAndPlay: (index: number) => void;
}

interface UseAyahAudioPlayerProps {
  audioUrls: string[];
  initialIndex?: number;
  autoPlayNext?: boolean;
}

export function useAyahAudioPlayer({
  audioUrls,
  initialIndex = 0,
  autoPlayNext = false
}: UseAyahAudioPlayerProps): [AudioPlayerState, AudioPlayerControls] {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Use refs to track latest values without triggering effects
  const currentAyahIndexRef = useRef(currentAyahIndex);
  const autoPlayNextRef = useRef(autoPlayNext);
  const audioUrlsRef = useRef(audioUrls);
  const shouldPlayAfterLoadRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    currentAyahIndexRef.current = currentAyahIndex;
  }, [currentAyahIndex]);

  useEffect(() => {
    autoPlayNextRef.current = autoPlayNext;
  }, [autoPlayNext]);

  useEffect(() => {
    audioUrlsRef.current = audioUrls;
  }, [audioUrls]);

  // Validate audio URL
  const isValidAudioUrl = useCallback((url: string): boolean => {
    return !!(url && url.trim().length > 0 && url.startsWith('http'));
  }, []);

  // Initialize audio element and attach event listeners ONCE
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      
      // If we should play after load, do it now
      if (shouldPlayAfterLoadRef.current) {
        shouldPlayAfterLoadRef.current = false;
        audio.play().then(() => {
          setIsPlaying(true);
          setError(null);
        }).catch((err) => {
          console.error('Failed to play audio after load:', err);
          setIsPlaying(false);
          setError('Ses çalınamadı');
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      
      // Use refs to get latest values
      const currentIndex = currentAyahIndexRef.current;
      const shouldAutoPlay = autoPlayNextRef.current;
      const urls = audioUrlsRef.current;
      
      if (shouldAutoPlay && currentIndex < urls.length - 1) {
        // Move to next ayah and continue playing
        const nextIndex = currentIndex + 1;
        setCurrentAyahIndex(nextIndex);
        shouldPlayAfterLoadRef.current = true;
      }
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setIsPlaying(false);
      shouldPlayAfterLoadRef.current = false;
      const errorMsg = 'Ses dosyası yüklenemedi';
      setError(errorMsg);
      console.error('Audio error:', e);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []); // Only run once on mount

  // Update audio source when ayah changes (but NOT when isPlaying changes)
  useEffect(() => {
    if (!audioRef.current) return;

    const currentUrl = audioUrls[currentAyahIndex];
    
    // Validate URL before attempting to load
    if (!isValidAudioUrl(currentUrl)) {
      setError('Ses dosyası bulunamadı');
      setIsPlaying(false);
      shouldPlayAfterLoadRef.current = false;
      return;
    }

    const audio = audioRef.current;

    // Only update source if it's different
    if (audio.src !== currentUrl) {
      audio.pause();
      audio.src = currentUrl;
      audio.load();
    }
  }, [currentAyahIndex, audioUrls, isValidAudioUrl]); // Removed isPlaying from dependencies

  const play = useCallback(() => {
    if (!audioRef.current) return;

    const currentUrl = audioUrls[currentAyahIndex];
    
    // Validate URL before playing
    if (!isValidAudioUrl(currentUrl)) {
      setError('Ses dosyası bulunamadı');
      return;
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setError(null);
    }).catch((err) => {
      console.error('Failed to play audio:', err);
      setIsPlaying(false);
      setError('Ses çalınamadı');
    });
  }, [audioUrls, currentAyahIndex, isValidAudioUrl]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextAyah = useCallback(() => {
    if (currentAyahIndex < audioUrls.length - 1) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      
      // If currently playing, continue playing the next ayah
      if (isPlaying) {
        shouldPlayAfterLoadRef.current = true;
      }
    }
  }, [currentAyahIndex, audioUrls.length, isPlaying]);

  const previousAyah = useCallback(() => {
    if (currentAyahIndex > 0) {
      const prevIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(prevIndex);
      
      // If currently playing, continue playing the previous ayah
      if (isPlaying) {
        shouldPlayAfterLoadRef.current = true;
      }
    }
  }, [currentAyahIndex, isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setAyahIndex = useCallback((index: number) => {
    if (index >= 0 && index < audioUrls.length) {
      setCurrentAyahIndex(index);
    }
  }, [audioUrls.length]);

  const selectAndPlay = useCallback((index: number) => {
    if (index < 0 || index >= audioUrls.length) return;
    
    const targetUrl = audioUrls[index];
    
    // Validate URL before attempting to play
    if (!isValidAudioUrl(targetUrl)) {
      setError('Ses dosyası bulunamadı');
      setIsPlaying(false);
      return;
    }

    // Set the index and mark that we should play after load
    setCurrentAyahIndex(index);
    shouldPlayAfterLoadRef.current = true;
  }, [audioUrls, isValidAudioUrl]);

  const state: AudioPlayerState = {
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    currentAyahIndex
  };

  const controls: AudioPlayerControls = {
    play,
    pause,
    togglePlayPause,
    nextAyah,
    previousAyah,
    seekTo,
    setAyahIndex,
    selectAndPlay
  };

  return [state, controls];
}
