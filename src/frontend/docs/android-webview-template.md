# Android Studio WebView Wrapper Template

This document provides a complete, minimal Android Studio (Kotlin) project template for wrapping the **Hadi Namaza** web application into a native Android APK/AAB using WebView.

## Overview

This template creates a native Android app that:
- Loads the web app in a full-screen WebView with JavaScript enabled
- Provides a JavaScript bridge (`WebAppInterface`) for native feature integration including notifications
- Implements offline-friendly caching with `LOAD_CACHE_ELSE_NETWORK`
- Handles edge-to-edge display with proper WindowInsets to avoid status/navigation bar overlap
- Includes a boot receiver with Android 10+ compliant notification-based launch (not direct Activity launch)
- Supports web-triggered native Android notifications via JavaScript bridge
- Uses AlarmManager with exact alarms for prayer time notifications
- Implements NotificationReceiver to display notifications when alarms trigger

## Prerequisites

- Android Studio (latest stable version recommended)
- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Kotlin 1.9+

## Project Structure

