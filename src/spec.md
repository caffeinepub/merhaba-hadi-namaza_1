# Specification

## Summary
**Goal:** Fix the Weekly Prayer Times table on mobile so the Day/Date column remains readable and visually separated during horizontal scrolling.

**Planned changes:**
- Make the weekly table horizontally scrollable within its own container on narrow/mobile widths (avoid scrolling the whole page).
- Implement a sticky first column (Day/Date) for both header and body cells using consistent sticky positioning, opaque background, and correct z-index layering.
- Add a persistent visual separator (border and/or shadow) between the sticky Day/Date column and the scrollable time columns, supporting both light and dark mode.
- Ensure “today” row styling remains readable and does not cause overlap/contrast issues in the sticky column while scrolling.

**User-visible outcome:** On mobile, users can scroll the weekly prayer times table horizontally without the time columns overlapping the Day/Date column; the left column stays fixed, readable, and clearly separated.
