import type { Location } from '../location/types';

const DB_NAME = 'merhaba-hadi-namaza-durable';
const DB_VERSION = 1;
const STORE_NAME = 'location';
const LOCATION_KEY = 'saved-location';

// Additional storage keys for redundancy
const LOCALSTORAGE_BACKUP_KEY = 'prayer-app-location-backup';
const SESSIONSTORAGE_BACKUP_KEY = 'prayer-app-location-session';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return dbPromise;
}

/**
 * Validate location object has required fields
 */
function isValidLocation(location: any): location is Location {
  return (
    location &&
    typeof location === 'object' &&
    typeof location.displayName === 'string' &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude)
  );
}

/**
 * Get location from localStorage backup
 */
function getFromLocalStorage(): Location | null {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
    if (!stored) return null;
    const location = JSON.parse(stored);
    return isValidLocation(location) ? location : null;
  } catch (error) {
    console.warn('Failed to read from localStorage backup:', error);
    return null;
  }
}

/**
 * Get location from sessionStorage backup
 */
function getFromSessionStorage(): Location | null {
  try {
    const stored = sessionStorage.getItem(SESSIONSTORAGE_BACKUP_KEY);
    if (!stored) return null;
    const location = JSON.parse(stored);
    return isValidLocation(location) ? location : null;
  } catch (error) {
    console.warn('Failed to read from sessionStorage backup:', error);
    return null;
  }
}

/**
 * Save location to localStorage backup
 */
function saveToLocalStorage(location: Location): void {
  try {
    localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(location));
  } catch (error) {
    console.warn('Failed to save to localStorage backup:', error);
  }
}

/**
 * Save location to sessionStorage backup
 */
function saveToSessionStorage(location: Location): void {
  try {
    sessionStorage.setItem(SESSIONSTORAGE_BACKUP_KEY, JSON.stringify(location));
  } catch (error) {
    console.warn('Failed to save to sessionStorage backup:', error);
  }
}

/**
 * Get location from IndexedDB
 */
async function getFromIndexedDB(): Promise<Location | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(LOCATION_KEY);

      request.onsuccess = () => {
        const location = request.result;
        resolve(isValidLocation(location) ? location : null);
      };

      request.onerror = () => {
        console.error('IndexedDB get error:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get from IndexedDB:', error);
    return null;
  }
}

/**
 * Save location to IndexedDB
 */
async function saveToIndexedDB(location: Location): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(location, LOCATION_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB put error:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
    throw error;
  }
}

/**
 * Get durable location with fallback chain:
 * 1. Try localStorage backup
 * 2. Try sessionStorage backup
 * 3. Try IndexedDB
 * Returns the first valid location found, or null if all fail
 */
export async function getDurableLocation(): Promise<Location | null> {
  console.log('[DurableStorage] Attempting to recover location...');

  // Try localStorage first (most reliable on mobile)
  const fromLocalStorage = getFromLocalStorage();
  if (fromLocalStorage) {
    console.log('[DurableStorage] Recovered from localStorage');
    return fromLocalStorage;
  }

  // Try sessionStorage
  const fromSessionStorage = getFromSessionStorage();
  if (fromSessionStorage) {
    console.log('[DurableStorage] Recovered from sessionStorage');
    // Backfill localStorage
    saveToLocalStorage(fromSessionStorage);
    return fromSessionStorage;
  }

  // Try IndexedDB
  const fromIndexedDB = await getFromIndexedDB();
  if (fromIndexedDB) {
    console.log('[DurableStorage] Recovered from IndexedDB');
    // Backfill other storages
    saveToLocalStorage(fromIndexedDB);
    saveToSessionStorage(fromIndexedDB);
    return fromIndexedDB;
  }

  console.log('[DurableStorage] No location found in any storage');
  return null;
}

/**
 * Set durable location to all storage mechanisms for maximum persistence
 */
export async function setDurableLocation(location: Location): Promise<void> {
  if (!isValidLocation(location)) {
    console.error('[DurableStorage] Invalid location object:', location);
    throw new Error('Invalid location object');
  }

  console.log('[DurableStorage] Saving location to all storage mechanisms:', location.displayName);

  // Save to all storage locations simultaneously
  saveToLocalStorage(location);
  saveToSessionStorage(location);
  
  try {
    await saveToIndexedDB(location);
    console.log('[DurableStorage] Successfully saved to all storages');
  } catch (error) {
    console.error('[DurableStorage] Failed to save to IndexedDB, but localStorage/sessionStorage succeeded');
    // Don't throw - localStorage/sessionStorage saves succeeded
  }
}

/**
 * Clear location from all storage mechanisms
 */
export async function clearDurableLocation(): Promise<void> {
  console.log('[DurableStorage] Clearing location from all storages');

  // Clear localStorage
  try {
    localStorage.removeItem(LOCALSTORAGE_BACKUP_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage backup:', error);
  }

  // Clear sessionStorage
  try {
    sessionStorage.removeItem(SESSIONSTORAGE_BACKUP_KEY);
  } catch (error) {
    console.warn('Failed to clear sessionStorage backup:', error);
  }

  // Clear IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(LOCATION_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB delete error:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
    throw error;
  }
}

/**
 * Verify storage integrity - check if location exists in all storages
 * Returns true if location is found in at least one storage
 */
export async function verifyStorageIntegrity(): Promise<boolean> {
  const fromLocalStorage = getFromLocalStorage();
  const fromSessionStorage = getFromSessionStorage();
  const fromIndexedDB = await getFromIndexedDB();

  const hasLocation = !!(fromLocalStorage || fromSessionStorage || fromIndexedDB);
  
  console.log('[DurableStorage] Storage integrity check:', {
    localStorage: !!fromLocalStorage,
    sessionStorage: !!fromSessionStorage,
    indexedDB: !!fromIndexedDB,
    hasLocation
  });

  return hasLocation;
}
