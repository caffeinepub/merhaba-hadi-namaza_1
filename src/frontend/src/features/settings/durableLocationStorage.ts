import type { Location } from '../location/types';

const DB_NAME = 'merhaba-hadi-namaza-durable';
const DB_VERSION = 1;
const STORE_NAME = 'location';
const LOCATION_KEY = 'saved-location';

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

export async function getDurableLocation(): Promise<Location | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(LOCATION_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        console.error('IndexedDB get error:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get durable location:', error);
    return null;
  }
}

export async function setDurableLocation(location: Location): Promise<void> {
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
    console.error('Failed to set durable location:', error);
    throw error;
  }
}

export async function clearDurableLocation(): Promise<void> {
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
    console.error('Failed to clear durable location:', error);
    throw error;
  }
}
