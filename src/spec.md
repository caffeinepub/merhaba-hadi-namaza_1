# Specification

## Summary
**Goal:** Make Quran ayah audio playback work reliably so pressing Play or an ayah’s Listen action produces audible recitation using Al Quran Cloud / Islamic Network CDN MP3 URLs.

**Planned changes:**
- Update the QuranOgreniyorumTab reader audio controls to always set a valid HTTPS MP3 source (from the ayah audio field and/or the Islamic Network CDN URL pattern) before attempting playback.
- Prevent playback attempts when the selected ayah audio URL is missing/empty, and show a clear error state instead of entering a “playing” state.
- Ensure the ayah-level “Listen” action sets the selected ayah in the player and starts audible playback immediately (even if audio was previously stopped).
- Surface HTMLAudioElement load/play errors in the existing audio controls error area, and keep Next/Previous behavior working when autoPlayNext is enabled.

**User-visible outcome:** In the Quran reader, tapping Play or an ayah’s Listen button immediately plays audible recitation for the selected ayah; if audio is unavailable or fails to load/play, the UI shows a clear error instead of staying silent.
