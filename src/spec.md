# Specification

## Summary
**Goal:** Make the user-selected location persist reliably across app restarts (including cases where Android WebView clears localStorage).

**Planned changes:**
- Store the selected default location in a more durable client-side storage than localStorage and treat it as the canonical saved location until the user changes it.
- Update settings load/restore logic to prefer the durable store when localStorage is missing/cleared, and fall back to the current behavior when both are empty.
- Update location save flows so changes are written to durable storage and localStorage before closing dialogs/navigation that depends on the saved location.
- Ensure all “set default location” entry points update the same persisted `settings.location`, while “temporary” location choices do not overwrite the default and no component resets the default location to null unless the user explicitly clears it.

**User-visible outcome:** After choosing a location, the app continues to show that same location after closing and reopening; if localStorage is cleared, the app automatically restores the saved location from durable storage, and the location picker only closes after the save completes.
