// Local date utilities for computing days remaining with Turkish locale support

/**
 * Get start of day in local timezone
 */
export function startOfLocalDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Calculate integer days between two dates (inclusive of start, exclusive of end)
 */
export function daysBetweenLocalDays(startDate: Date, endDate: Date): number {
  const start = startOfLocalDay(startDate);
  const end = startOfLocalDay(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display in Turkish locale
 */
export function formatDateForDisplay(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
