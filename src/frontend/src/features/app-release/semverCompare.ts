/**
 * Compare two semantic version strings.
 * 
 * Returns:
 * - positive number if version1 > version2
 * - negative number if version1 < version2
 * - 0 if versions are equal
 * 
 * Handles versions in format: x.y.z (e.g., "1.2.3")
 * Falls back to string comparison if parsing fails.
 * 
 * Examples:
 * - semverCompare("1.2.3", "1.2.2") => 1 (newer)
 * - semverCompare("1.0.0", "2.0.0") => -1 (older)
 * - semverCompare("1.0.0", "1.0.0") => 0 (equal)
 */
export function semverCompare(version1: string, version2: string): number {
  try {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    // Ensure we have at least 3 parts (major.minor.patch)
    while (v1Parts.length < 3) v1Parts.push(0);
    while (v2Parts.length < 3) v2Parts.push(0);

    // Check if any part failed to parse
    if (v1Parts.some(isNaN) || v2Parts.some(isNaN)) {
      // Fallback to string comparison
      return version1.localeCompare(version2);
    }

    // Compare major, minor, patch in order
    for (let i = 0; i < 3; i++) {
      if (v1Parts[i] !== v2Parts[i]) {
        return v1Parts[i] - v2Parts[i];
      }
    }

    return 0;
  } catch {
    // Fallback to string comparison on any error
    return version1.localeCompare(version2);
  }
}

/**
 * Check if newVersion is newer than currentVersion.
 */
export function isNewerVersion(newVersion: string, currentVersion: string): boolean {
  return semverCompare(newVersion, currentVersion) > 0;
}
