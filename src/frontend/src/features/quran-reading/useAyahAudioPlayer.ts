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

  // Validate audio URL
  const isValidAudioUrl = useCallback((url: string): boolean => {
    return !!(url && url.trim().length > 0 && url.startsWith('http'));
  }, []);

  // Initialize audio element
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
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (autoPlayNext && currentAyahIndex < audioUrls.length - 1) {
        // Move to next ayah and continue playing
        const nextIndex = currentAyahIndex + 1;
        setCurrentAyahIndex(nextIndex);
        // The audio source will be updated in the next effect, and we'll auto-play
      }
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setIsPlaying(false);
      const errorMsg = 'Ses dosyası yüklenemedi';
      setError(errorMsg);
      console.error('Audio error:', e);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoPlayNext, currentAyahIndex, audioUrls.length]);

  // Update audio source when ayah changes
  useEffect(() => {
    if (!audioRef.current) return;

    const currentUrl = audioUrls[currentAyahIndex];
    
    // Validate URL before attempting to load
    if (!isValidAudioUrl(currentUrl)) {
      setError('Ses dosyası bulunamadı');
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    audio.pause();
    audio.src = currentUrl;
    audio.load();

    if (wasPlaying) {
      audio.play().catch((err) => {
        console.error('Failed to play audio:', err);
        setIsPlaying(false);
        setError('Ses çalınamadı');
      });
    }
  }, [currentAyahIndex, audioUrls, isValidAudioUrl, isPlaying]);

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
        // The effect will handle loading and playing
        // We just need to maintain the playing state
      }
    }
  }, [currentAyahIndex, audioUrls.length, isPlaying]);

  const previousAyah = useCallback(() => {
    if (currentAyahIndex > 0) {
      const prevIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(prevIndex);
      
      // If currently playing, continue playing the previous ayah
      if (isPlaying) {
        // The effect will handle loading and playing
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

    // Set the index first
    setCurrentAyahIndex(index);
    
    // Then play after a brief delay to allow the effect to update the source
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setError(null);
        }).catch((err) => {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
          setError('Ses çalınamadı');
        });
      }
    }, 100);
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
