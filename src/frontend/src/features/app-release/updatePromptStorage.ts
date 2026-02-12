/**
 * Local storage utilities for remembering dismissed update prompts.
 * 
 * The dismissed version is stored locally so the prompt doesn't reappear
 * for the same version. When the backend version changes to a newer value,
 * the prompt will automatically reappear.
 */

const STORAGE_KEY = 'hadi-namaza-dismissed-update-version';

/**
 * Get the last dismissed version from localStorage.
 */
export function getDismissedVersion(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Save a dismissed version to localStorage.
 */
export function setDismissedVersion(version: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, version);
  } catch (error) {
    console.error('Failed to save dismissed version:', error);
  }
}

/**
 * Clear the dismissed version from localStorage.
 */
export function clearDismissedVersion(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear dismissed version:', error);
  }
}
