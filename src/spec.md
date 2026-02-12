# Specification

## Summary
**Goal:** Add a new “Namaz Takibi” tab to track daily prayers and kaza (make-up) prayer counts, with state persisted locally like the existing “Oruç Takibi”.

**Planned changes:**
- Add a new top-level tab “Namaz Takibi” wired into the main tab navigation, including the overflow menu.
- Implement a “Daily Prayers” checklist for the 5 daily prayers, toggleable and persisted per calendar date via existing local settings persistence.
- Implement a “Kaza (Make-up) Prayers” section with per-prayer counters that can be set/updated and reduced without going below zero, persisted via local settings.
- Extend the local settings model and storage migration to include prayer tracking fields (daily checklist by date + kaza counts) with a storage version bump and forward migration defaults.

**User-visible outcome:** Users can open the new “Namaz Takibi” tab, check off today’s five daily prayers, and track/update/reduce remaining kaza counts for each prayer; all data remains saved locally across refreshes.
