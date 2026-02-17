# Specification

## Summary
**Goal:** Show a seconds-based next-prayer countdown (mm:ss / HH:mm:ss) in the app and Android persistent notification, without spamming next-prayer bridge updates.

**Planned changes:**
- Update the next-prayer countdown hook to recompute remaining time every second and format it as zero-padded mm:ss (< 1 hour) or HH:mm:ss (>= 1 hour), based on `nextPrayerMillis` and current time.
- Ensure `sendPrayerTimesToAndroidPush` includes a `timeRemaining` string using the same seconds-inclusive format, and that updates propagate through `useAndroidPushPrayerTimes`.
- Keep existing behavior so `sendNextPrayerToAndroid` and `sendNextPrayerWithTimeString` only fire when the next prayer (or its scheduled time) changes, not every second.

**User-visible outcome:** The persistent next-prayer countdown updates smoothly every second with seconds shown (mm:ss or HH:mm:ss), including in the Android persistent notification, while next-prayer identity updates remain non-spammy.
