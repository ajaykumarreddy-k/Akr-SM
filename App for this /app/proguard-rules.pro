# ProGuard configuration for AKR-SM WebView Application

# Keep Javascript interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebChromeClient and WebViewClient custom subclasses
-keep public class * extends android.webkit.WebViewClient
-keep public class * extends android.webkit.WebChromeClient

# Preserve line number information for debugging stack traces
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable

# Firebase Messaging rules
-keep class com.google.firebase.messaging.** { *; }
-dontwarn com.google.firebase.messaging.**
