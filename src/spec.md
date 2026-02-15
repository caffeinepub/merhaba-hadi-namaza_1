# Specification

## Summary
**Goal:** Provide a “final and complete” Android Studio WebView wrapper guide (as documentation) covering offline-first caching, native notifications via JS bridge, prayer-time scheduling with persistent notification, Play Store update checks, and edge-to-edge insets handling; and update the React web UI to respect safe-area insets when embedded in an edge-to-edge Android WebView.

**Planned changes:**
- Expand `frontend/docs/android-webview-template.md` into a complete, file-by-file Android WebView wrapper guide with sequential, copy-pasteable Kotlin/Gradle/manifest/resource code covering:
  - Offline-first WebView caching (`WebSettings.cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK`) and related WebSettings for offline-friendly behavior
  - JavaScript bridge contracts compatible with existing web expectations (e.g., `window.Android.showNotification(title, body)`, `window.Android.getAppVersion()`, `window.AndroidPush.sendPrayerTimes(json)` / fallback)
  - Android 13+ runtime notification permission flow (`POST_NOTIFICATIONS`) and an option to open system notification settings
  - Scheduling prayer-time alarms and an ongoing (non-dismissible) status-bar notification for the next prayer time
  - Play Store version checking and a native notification when an update is available
  - Edge-to-edge / WindowInsets handling to keep WebView content inset-aware (not under status/navigation bars)
- Add global safe-area padding support to the React UI using CSS `env(safe-area-inset-*)` variables and apply it to the top-level app container so content does not render under system UI in edge-to-edge WebView.

**User-visible outcome:** The repo includes a complete Android WebView wrapper documentation template that can be copied into Android Studio to produce an offline-capable, notification-enabled, inset-safe wrapper; and the web app UI will respect safe-area insets when run inside an edge-to-edge Android WebView.
