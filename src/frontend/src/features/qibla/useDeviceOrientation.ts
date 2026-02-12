import { useState, useEffect } from 'react';

interface DeviceOrientationState {
  heading: number | null;
  isSupported: boolean;
  isPermissionDenied: boolean;
  isLoading: boolean;
  requestPermission: () => Promise<void>;
}

/**
 * Hook to access device orientation and compute heading
 * Handles permission requests for iOS 13+ devices
 */
export function useDeviceOrientation(): DeviceOrientationState {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    // Check if DeviceOrientationEvent exists
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    // iOS 13+ requires explicit permission
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsPermissionDenied(false);
          setIsSupported(true);
        } else {
          setIsPermissionDenied(true);
          setIsSupported(false);
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setIsPermissionDenied(true);
        setIsSupported(false);
      }
    } else {
      // Non-iOS or older iOS - permission not required
      setIsSupported(true);
      setIsPermissionDenied(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial check
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    // For non-iOS devices, automatically set as supported
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      setIsSupported(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Use alpha for compass heading (0-360 degrees)
      // alpha: rotation around z-axis (compass direction)
      if (event.alpha !== null) {
        // Normalize to 0-360
        let compassHeading = event.alpha;
        
        // On some devices, we need to account for webkitCompassHeading
        if ((event as any).webkitCompassHeading !== undefined) {
          compassHeading = (event as any).webkitCompassHeading;
        }
        
        setHeading(compassHeading);
      }
    };

    if (isSupported && !isPermissionDenied) {
      window.addEventListener('deviceorientation', handleOrientation);
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [isSupported, isPermissionDenied]);

  return {
    heading,
    isSupported,
    isPermissionDenied,
    isLoading,
    requestPermission
  };
}
