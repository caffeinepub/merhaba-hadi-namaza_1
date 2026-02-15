# Specification

## Summary
**Goal:** Fix the Weekly Prayer Times table on mobile so horizontal scrolling works without the left Day/Date column text overlapping with the time columns.

**Planned changes:**
- Wrap the weekly prayer times table in a dedicated horizontal-scroll container for small screens to keep scrolling contained within the table area.
- Make the first (Day/Date) column sticky during horizontal scroll, with an opaque background and a clear visual separator (border and/or shadow) so scrolled columns don’t show through or blend.
- Apply consistent sticky/scroll styling to both header and body cells (matching background treatment and z-index layering) to prevent header/body mismatch while scrolling.
- Enforce a consistent minimum table width on narrow screens so columns don’t collapse into each other.

**User-visible outcome:** On mobile, users can swipe horizontally within the Weekly Prayer Times table to view all columns, while the Day/Date column remains readable, visually separated, and does not overlap with the time columns.
