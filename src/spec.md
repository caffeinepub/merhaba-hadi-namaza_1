# Specification

## Summary
**Goal:** Show prayer times for the next 7 days on the Home page for the currently selected location.

**Planned changes:**
- Add a new frontend data-fetching utility (using the existing Aladhan API approach) to retrieve prayer times for today + the next 6 days, parameterized by the selected location’s latitude/longitude.
- Integrate the new 7-day query with React Query, including a cache key that incorporates the selected coordinates, disabling the query when no location is selected, and showing a user-friendly error state on failure.
- Update `frontend/src/features/home/HomeTab.tsx` to render a Home-styled weekly section in a table/list format with 7 rows and fields for: date/day label, İmsak (Fajr), Güneş (Sunrise), Öğle (Dhuhr), İkindi (Asr), Akşam (Maghrib), Yatsı (Isha), applying the user’s configured `settings.offsetMinutes` consistently across all displayed times and matching existing loading/error UI patterns.

**User-visible outcome:** When a location is selected, the Home page shows a weekly (7-day) prayer-times table/list for that location; if no location is selected, the weekly section is not shown.
