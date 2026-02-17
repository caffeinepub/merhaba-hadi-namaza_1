/**
 * Formats a remaining duration (in milliseconds) into a zero-padded countdown string.
 * 
 * - For durations under 1 hour: returns mm:ss format (e.g., "04:09")
 * - For durations of 1 hour or more: returns HH:mm:ss format (e.g., "01:04:09")
 * - Negative values are clamped to "00:00" or "00:00:00"
 * 
 * @param remainingMillis - Remaining time in milliseconds
 * @returns Formatted countdown string
 */
export function formatRemainingTime(remainingMillis: number): string {
  // Clamp negative values to zero
  if (remainingMillis < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(remainingMillis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Zero-pad helper
  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    // HH:mm:ss format
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    // mm:ss format
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}
