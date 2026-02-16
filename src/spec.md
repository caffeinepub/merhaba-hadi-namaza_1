# Specification

## Summary
**Goal:** Fix the AndroidPush prayer-times payload schema so Android can parse `dailyPrayers` and `weeklyPrayers` without crashes, and document correct web + Android parsing/notification update patterns.

**Planned changes:**
- Update `frontend/src/features/home/useAndroidPushPrayerTimes.ts` to build `dailyPrayers` and `weeklyPrayers` as arrays of `{ name, time, timeMillis }` objects (not string arrays) and send via `window.AndroidPush.sendPrayerTimes(JSON.stringify(jsonData))` with safe failure behavior on invalid/missing data.
- Update `frontend/src/androidPushBridge.d.ts` and `frontend/src/utils/androidBridge.ts` validation/types to match the new schema and keep the `sendPrayerTimes` then `send` fallback, without throwing in non-Android browsers.
- Add/extend developer documentation under `frontend/docs/` with copy-pasteable JavaScript (payload construction + sending) and Kotlin (SharedPreferences storage, `JSONObject`/`JSONArray` parsing, next-prayer selection using `timeMillis`, periodic persistent-notification refresh) examples in English.

**User-visible outcome:** Prayer times are delivered to the Android app via the WebView bridge in a schema Android can parse reliably, and developers have clear examples for generating, parsing, storing, and using the payload to update ongoing notifications.
