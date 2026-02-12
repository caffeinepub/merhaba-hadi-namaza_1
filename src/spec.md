# Specification

## Summary
**Goal:** Rebuild the Cuma Hutbesi tab and its backend support so it reliably fetches, caches, and displays only the latest Diyanet Friday sermon as plain text, with a weekly refresh window.

**Planned changes:**
- Fix backend fetching/parsing to identify the latest sermon by parsing the Diyanet Turkish listing page, following the newest sermon detail URL, and returning structured data (title, date, plain-text content).
- Add cache metadata and refresh logic so the first request after Friday 10:00 (Turkey time) refreshes the cached sermon; keep the existing manual refresh behavior to force updates anytime.
- Ensure backend always returns plain text (no raw HTML), extracting from the detail page HTML; only attempt DOC/DOCX parsing if feasible within canister constraints and without external conversion services.
- Rebuild/clean up the Cuma Hutbesi tab UI to show only the latest sermon with clear loading/error/empty states and a user-initiated refresh action wired to the backend.
- Adjust React Query behavior so previously loaded sermon content stays visible during background refresh, avoiding repeated refetch loops and long blocking spinners on mobile; ensure refreshed data updates the UI immediately.
- Ensure all new/changed user-facing text in the Cuma Hutbesi tab is in English.

**User-visible outcome:** Users can open the Cuma Hutbesi tab and reliably read the latest Diyanet sermon (title/date/plain text). The tab shows clear loading/error/empty states and supports refresh without hiding previously loaded content; the sermon updates automatically after Friday 10:00 (TR time) on the next request.
