import { useState, useEffect } from 'react';
import { ramadanMenusData, RamadanMenu } from './ramadanMenusData';

/**
 * Hook that returns the menu for the current day based on local date.
 * The menu rotates daily at midnight and updates automatically.
 */
export function useDailyRotatingRamadanMenu(): RamadanMenu {
  const [currentMenu, setCurrentMenu] = useState<RamadanMenu>(() => getMenuForToday());

  useEffect(() => {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout to update at midnight
    const timeoutId = setTimeout(() => {
      setCurrentMenu(getMenuForToday());
      
      // Set up daily interval after first midnight update
      const intervalId = setInterval(() => {
        setCurrentMenu(getMenuForToday());
      }, 24 * 60 * 60 * 1000); // 24 hours

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return currentMenu;
}

/**
 * Deterministically selects a menu based on the current local date.
 * Same date always returns the same menu.
 */
function getMenuForToday(): RamadanMenu {
  const now = new Date();
  const dayOfYear = getDayOfYear(now);
  
  // Use modulo to cycle through the 30 menus
  const menuIndex = dayOfYear % ramadanMenusData.length;
  
  return ramadanMenusData[menuIndex];
}

/**
 * Calculate the day of the year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
