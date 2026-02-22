import { useState, useEffect, useRef } from 'react';
import { ramadanMenusData, RamadanMenu } from './ramadanMenusData';

/**
 * Hook that returns the menu for the current day based on local date.
 * The menu rotates daily at midnight and updates automatically.
 */
export function useDailyRotatingRamadanMenu(): RamadanMenu {
  const [currentMenu, setCurrentMenu] = useState<RamadanMenu>(() => getMenuForToday());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout to update at midnight
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentMenu(getMenuForToday());
      }
      
      // Set up daily interval after first midnight update
      const intervalId = setInterval(() => {
        if (isMountedRef.current) {
          setCurrentMenu(getMenuForToday());
        }
      }, 24 * 60 * 60 * 1000); // 24 hours

      // Store interval ID for cleanup
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    // Cleanup timeout and interval on unmount
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return currentMenu;
}

/**
 * Deterministically selects a menu based on the current local date.
 * Uses day of year to ensure the same menu is shown throughout the day.
 */
function getMenuForToday(): RamadanMenu {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Use modulo to cycle through the 30 menus
  const menuIndex = dayOfYear % ramadanMenusData.length;
  return ramadanMenusData[menuIndex];
}
