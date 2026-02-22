# Specification

## Summary
**Goal:** Restore prayer times feature by re-integrating Aladhan API, enabling manual location selection, and displaying prayer times on Home and Ramazan tabs.

**Planned changes:**
- Restore backend proxy endpoint to fetch prayer times from Aladhan API without CORS issues
- Implement manual location selection UI with city search/dropdown and persist selection across sessions
- Display prayer times immediately after location selection without manual refresh
- Show all six prayer times on Home tab with proper formatting
- Show sahur (Fajr) and iftar (Maghrib) times prominently on Ramazan tab
- Verify next prayer countdown, weekly prayer times table, Android widget updates, and kerahat time calculations work with restored data

**User-visible outcome:** Users can select their location, see prayer times immediately displayed on both Home and Ramazan tabs, and all prayer time-dependent features (countdown, weekly table, widgets, kerahat times) function correctly with live data from Aladhan API.
