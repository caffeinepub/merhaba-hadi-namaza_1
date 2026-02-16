# Android Studio WebView Wrapper Template - Complete Guide

This document provides a complete, copy-pasteable Android Studio (Kotlin) project template for wrapping the **Hadi Namaza** web application into a native Android APK/AAB using WebView.

## Overview

This template creates a native Android app that:
- Loads the web app in a full-screen WebView with JavaScript enabled
- Provides a JavaScript bridge (`WebAppInterface`) for native feature integration
- Implements offline-friendly caching with `LOAD_CACHE_ELSE_NETWORK`
- Handles edge-to-edge display with proper WindowInsets to avoid status/navigation bar overlap
- Supports web-triggered native Android notifications via JavaScript bridge
- Uses AlarmManager with exact alarms for prayer time notifications
- Implements persistent notification showing the next prayer time
- Includes Play Store version checking with update notifications
- Handles Android 13+ notification permissions with settings access

## Prerequisites

- Android Studio (latest stable version recommended)
- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Kotlin 1.9+
- Firebase Cloud Messaging (FCM) configured in your project

## AndroidPush JavaScript Bridge Integration

### Overview

The web app sends prayer times data to Android via the `window.AndroidPush` JavaScript interface. This section provides complete examples for both web (JavaScript/TypeScript) and Android (Kotlin) sides.

### Web Side: Sending Prayer Times

The web app computes prayer times and sends them as a JSON payload containing:
- **nextPrayer**: Name of the next prayer (e.g., "İmsak", "Öğle", "İkindi")
- **nextPrayerMillis**: Epoch timestamp in milliseconds for the next prayer
- **nextPrayerTime**: HH:MM time string for the next prayer
- **timeRemaining**: Countdown string (e.g., "1 saat 23 dakika")
- **dailyPrayers**: Array of objects with `{ name, time, timeMillis }` for today's 6 prayers
- **weeklyPrayers**: Array of objects with `{ name, time, timeMillis }` for the next 7 days (42 entries total)

#### Example JavaScript/TypeScript Code

