# Specification

## Summary
**Goal:** Fix prayer times display by restoring Aladhan API integration and implement persistent city selection.

**Planned changes:**
- Restore Aladhan API integration in backend proxy with method 13 for Turkish cities
- Fix prayer times display on homepage to show daily and weekly times without errors
- Fix prayer times display on Ramazan tab to show sahur and iftar times correctly
- Implement persistent city selection using localStorage so the selected city is remembered across sessions
- Ensure hourly prayer time countdown displays correctly on homepage

**User-visible outcome:** Users can view daily and weekly prayer times on the homepage and Ramazan tab without errors. Selected city persists across browser sessions and prayer countdowns work correctly.
