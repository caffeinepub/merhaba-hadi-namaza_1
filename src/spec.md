# Specification

## Summary
**Goal:** Add a dedicated 30-day Ramadan fasting checklist inside the existing Fasting Tracker.

**Planned changes:**
- Add a “Ramadan (30 days)” section in the Fasting Tracker tab with 30 individually toggleable items (Day 1–Day 30) and a live progress indicator (X/30).
- Add a one-tap reset/clear action to unmark all Ramadan days with a confirmation or clearly safe UX.
- Persist the Ramadan checklist state in local settings, including a forward-compatible localStorage migration/version bump so existing users’ settings continue to load safely.
- Ensure the Ramadan checklist layout is mobile-friendly (no horizontal scrolling) and matches the app’s existing warm theme/components.

**User-visible outcome:** Users can track Ramadan fasting across 30 days by checking off each day, see progress at a glance, reset the list when needed, and have their checklist persist across reloads without affecting existing fasting tracking.
