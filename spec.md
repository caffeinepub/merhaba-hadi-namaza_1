# Hadi Namaza

## Current State

Full-featured Turkish Islamic web app with:
- Prayer times via Aladhan API (direct browser fetch, no backend proxy)
- Location stored in localStorage + indexedDB
- Home tab with location dialog, prayer countdown, weekly table, weather
- DuaGuideTab with category tabs but no search/filter
- Multiple feature tabs (Esmaül Hüsna, Zikirmatik, Quran, Fasting, Prayer tracking, etc.)
- Dark mode CSS tokens already defined in index.css but no toggle UI
- Responsive Tailwind classes throughout

## Requested Changes (Diff)

### Add
- **Dark mode toggle**: A sun/moon button in the header to toggle dark mode. Persist preference in localStorage. Apply `dark` class to `<html>` element.
- **Dua search/filter**: A search input in DuaGuideTab to filter duas by title, occasion, or translation text across all categories.
- **Backend prayer times proxy**: Route prayer time fetches through the Motoko backend (HTTP outcalls) to eliminate CORS errors. Frontend falls back to direct fetch if backend unavailable.

### Modify
- **Location change white screen fix**: When the location dialog closes after a successful selection, ensure `queryClient.invalidateQueries` fully resolves before closing. Also add an error boundary and loading skeleton to HomeTab so a failed re-fetch never shows a blank screen.
- **Location persistence hardening**: After saving a location, immediately write to all 3 storage layers (localStorage main key, manual location key, IndexedDB). On app start, try all 3 before falling back to default.
- **Accessibility improvements**: Increase base font sizes on prayer time cards and key labels. Ensure all interactive elements have min touch target 44px. Add `aria-label` to icon-only buttons.
- **Responsive improvements**: Fix any remaining mobile layout issues — particularly the header on very small screens (320px) and the weekly prayer times table on mobile portrait.

### Remove
- Nothing removed.

## Implementation Plan

1. Add dark mode toggle button to App.tsx header; implement `useDarkMode` hook that reads/writes `localStorage` and toggles `document.documentElement.classList`.
2. Add a search input to DuaGuideTab above the category tabs; filter `currentDuas` across ALL categories when search is active.
3. Fix HomeTab white screen: wrap content in React `Suspense`/error boundary, ensure location dialog only closes after cache invalidation completes (already mostly done but add `await` guard), add skeleton loading state.
4. Harden location save in `LocationSetupSection`: after save, call `queryClient.invalidateQueries` and then `queryClient.refetchQueries` to force a fresh re-fetch.
5. Accessibility: raise font sizes on prayer name/time labels, ensure buttons have `aria-label`.
6. Responsive: ensure header title truncates gracefully on 320px screens using `truncate` class; verify weekly table wrapper on mobile.
