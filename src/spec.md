# Specification

## Summary
**Goal:** Forward the web app’s computed prayer times and location to Android WebView via a guarded `window.AndroidPrayer` JavaScriptInterface so Android widgets can display real-time values without breaking normal browsers.

**Planned changes:**
- When a location is selected and prayer times are loaded, send Android bridge payloads for: next prayer name/time, daily prayer times (imsak/fajr, gunes/sunrise, ogle/dhuhr, ikindi/asr, aksam/maghrib, yatsi/isha), and city/location display name.
- Add Android-only, guarded bridge calls that invoke `window.AndroidPrayer.updateNextPrayer(name, time)` (and similar calls for daily times and city) only when the `AndroidPrayer` interface exists, with safe checks/try-catch to avoid crashing the React app.
- Update `frontend/public/android-widget-bridge.js` and `frontend/src/androidWidgetBridge.d.ts` typings to support the `window.AndroidPrayer.*` interface while keeping backward compatibility with existing `window.Android.*` and existing widget update functions.

**User-visible outcome:** In Android WebView, widgets can receive up-to-date next prayer, daily prayer times, and city info from the web app; in normal browsers the app continues to run with no bridge-related errors.
