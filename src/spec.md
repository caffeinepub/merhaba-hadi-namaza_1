# Specification

## Summary
**Goal:** Fix location persistence in localStorage to survive cache clearing on mobile devices and prevent app crashes.

**Planned changes:**
- Ensure manually selected location data persists in localStorage even after cache clearing
- Prevent app crashes when localStorage is cleared by gracefully handling missing location data
- Add fallback to a default location (Istanbul) when no location is available
- Display location selection prompt instead of breaking when location data is unavailable

**User-visible outcome:** Users can select their location once, and it will remain saved even after clearing browser cache or closing the app on mobile devices. If location data is lost, the app will continue to function with a default location and prompt users to select their actual location rather than crashing.
