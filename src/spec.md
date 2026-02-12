# Specification

## Summary
**Goal:** Fix Cuma Hutbesi loading failures and make fetching the latest sermon fast and reliable by moving all retrieval/parsing to the backend with caching.

**Planned changes:**
- Update the backend to use the exact Diyanet listing URL (https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e) without double-URL-encoding.
- Add a backend canister method that fetches the listing + latest sermon detail via IC HTTP outcalls, parses them, and returns a structured result: {title, date, content}, with clear backend errors when parsing fails.
- Add backend caching for the latest parsed sermon with a TTL, plus a way for the frontend refresh action to bypass/revalidate the cache.
- Update the frontend Cuma Hutbesi data flow to call the new backend structured method (no DOMParser-based link scraping and no browser fetch to Diyanet), keeping any newly introduced user-facing text in English while preserving the tab label exactly as “Cuma Hutbesi”.
- Tune React Query settings for the sermon query to keep previously shown content visible during background refetch and reduce unnecessary refetch loops (mobile-friendly caching/refetch behavior).

**User-visible outcome:** The Cuma Hutbesi tab loads quickly and consistently, showing the latest sermon title/date/content without long waits or CORS-related failures; refresh updates content without blanking already displayed sermon text.
