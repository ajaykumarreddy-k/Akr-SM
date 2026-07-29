# AKR-SM Production Native Android Application

A production-ready Android Application built with **Kotlin**, **Android SDK 36**, **Gradle (Kotlin DSL)**, **Material 3**, and **Edge-to-Edge UI**. This app provides a high-performance native WebView container for the web application at `https://akr-sm.vercel.app/`.

---

## Features & Capabilities

- **Modern Architecture**: Clean package structure (`com.akr.sm`), View Binding, and Gradle Version Catalog (`libs.versions.toml`).
- **Android 12+ Splash Screen**: Integrated via `androidx.core:core-splashscreen` API with themed splash window.
- **Edge-to-Edge Design**: Full edge-to-edge layout handling system bar insets (`WindowCompat`, `ViewCompat.setOnApplyWindowInsetsListener`).
- **Advanced WebView Engine**:
  - JavaScript, DOM Storage, LocalStorage, SessionStorage enabled.
  - Custom Cookie management with third-party cookie support.
  - Native file upload chooser supporting gallery selection and camera capture.
  - Native file download manager using system `DownloadManager`.
  - Dynamic WebRTC permissions for Camera (`CAMERA`) and Microphone (`RECORD_AUDIO`).
  - Dynamic Geolocation permissions (`ACCESS_FINE_LOCATION`).
  - Handling for `target="_blank"` multi-window requests.
  - Android Intent handling for `mailto:`, `tel:`, `maps:`, `whatsapp:`, and external URLs.
- **Offline & Network Resilience**:
  - Live network monitoring (`ConnectivityManager.NetworkCallback`).
  - Beautiful offline layout fallback with custom illustration.
  - Automatic page reload when connectivity is restored.
  - Pull-to-refresh (`SwipeRefreshLayout`).
- **Push Notifications & FCM**:
  - Firebase Cloud Messaging integration (`MyFirebaseMessagingService`).
  - Notification permission prompt for Android 13+ (API 33+).
  - Notification channel setup (`NotificationChannel`).
- **Security Best Practices**:
  - HTTPS only (`network_security_config.xml`, `android:usesCleartextTraffic="false"`).
  - Mixed content disabled (`MIXED_CONTENT_NEVER_ALLOW`).
  - Web contents debugging enabled strictly in `DEBUG` builds (`BuildConfig.DEBUG`).
  - Local file access restricted (`allowFileAccess = false`, `allowContentAccess = false`).
  - Code shrinking & obfuscation enabled via ProGuard rules (`proguard-rules.pro`).

---

## Project Structure

```text
App for this/
├── app/
│   ├── build.gradle.kts            # App module build script (Kotlin DSL)
│   ├── proguard-rules.pro          # Obfuscation & optimization rules
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml # App manifest & permissions
│           ├── java/com/akr/sm/
│           │   ├── MainActivity.kt # Primary Activity & WebView host
│           │   ├── network/        # NetworkMonitor (Connectivity listener)
│           │   ├── service/        # MyFirebaseMessagingService (FCM)
│           │   └── utils/          # DownloadHandler (File download manager)
│           └── res/                # XML layouts, strings, values, drawables
├── gradle/
│   └── libs.versions.toml          # Gradle Version Catalog
├── build.gradle.kts                # Root project build configuration
├── settings.gradle.kts             # Subproject & repository settings
└── README.md
```

---

## Prerequisites

- **Android Studio**: Ladybug (2024.2+) or higher.
- **JDK**: Java 17.
- **Android SDK**: SDK 36 (Build Tools 36.0.0).
- **Min Android Support**: Android 8.0 (API Level 26).

---

## Building the Project

### 1. Build Debug APK

To compile and assemble the debug APK:

```bash
./gradlew assembleDebug
```

The output APK will be located at:
`app/build/outputs/apk/debug/app-debug.apk`

---

### 2. Generate Signed Release APK / AAB (Google Play Store)

To build a production signed APK or Android App Bundle (AAB):

#### Step 2.1: Generate Keystore
If you don't have an existing signing key, generate one via keytool:

```bash
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias akr-sm-key
```

#### Step 2.2: Configure Signing in `app/build.gradle.kts`
Update `app/build.gradle.kts` with your keystore credentials or set environment variables:

```kotlin
android {
    ...
    signingConfigs {
        create("release") {
            storeFile = file("path/to/release.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "your_password"
            keyAlias = "akr-sm-key"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "your_password"
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

#### Step 2.3: Build Signed AAB (App Bundle for Play Store)

```bash
./gradlew bundleRelease
```

The signed AAB file will be generated at:
`app/build/outputs/bundle/release/app-release.aab`

#### Step 2.4: Build Signed Release APK

```bash
./gradlew assembleRelease
```

---

## Setting Up Firebase Cloud Messaging (FCM)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project and add an Android Application with Package Name: `com.akr.sm`.
3. Download `google-services.json`.
4. Place `google-services.json` inside the `app/` directory:
   `app/google-services.json`
5. Rebuild the project. The Google Services Gradle plugin will automatically bind the config.

---

## License & Credits

Developed for AKR-SM. All rights reserved.
