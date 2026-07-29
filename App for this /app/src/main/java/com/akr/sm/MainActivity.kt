package com.akr.sm

import android.Manifest
import android.app.Dialog
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.akr.sm.databinding.ActivityMainBinding
import com.akr.sm.network.NetworkMonitor
import com.akr.sm.utils.DownloadHandler
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var networkMonitor: NetworkMonitor
    private lateinit var downloadHandler: DownloadHandler
    private var networkCallback: ConnectivityManager.NetworkCallback? = null

    // Callbacks & Uri for Web File Uploads
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraImageUri: Uri? = null

    // Pending Web Chrome Permission Requests
    private var pendingPermissionRequest: PermissionRequest? = null
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null

    // Manual navigation stack maintained via JavascriptInterface
    // React Router uses pushState which bypasses WebView's native history,
    // so we intercept it from JS and track it ourselves.
    private val navStack = ArrayDeque<String>()

    private val targetUrl by lazy { getString(R.string.website_url) }

    /**
     * JavascriptInterface bridge called from injected JS whenever
     * React Router navigates (pushState) or goes back (popstate).
     */
    inner class NavBridge {
        @android.webkit.JavascriptInterface
        fun onPush(url: String) {
            runOnUiThread {
                navStack.addLast(url)
                android.util.Log.d("AKR_NAV", "PUSH: $url | depth=${navStack.size}")
            }
        }

        @android.webkit.JavascriptInterface
        fun onPop() {
            runOnUiThread {
                if (navStack.isNotEmpty()) navStack.removeLast()
                android.util.Log.d("AKR_NAV", "POP via popstate | depth=${navStack.size}")
            }
        }
    }

    // Activity Result Launcher for File Chooser (Uploads)
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileUploadCallback == null) return@registerForActivityResult

        var results: Array<Uri>? = null
        if (result.resultCode == RESULT_OK) {
            val data = result.data
            if (data?.data != null) {
                results = arrayOf(data.data!!)
            } else if (data?.clipData != null) {
                val clipData = data.clipData!!
                results = Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
            } else if (cameraImageUri != null) {
                results = arrayOf(cameraImageUri!!)
            }
        }
        fileUploadCallback?.onReceiveValue(results)
        fileUploadCallback = null
        cameraImageUri = null
    }

    // Activity Result Launcher for Media Permissions (Camera & Microphone)
    private val mediaPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[Manifest.permission.CAMERA] ?: false
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false

        pendingPermissionRequest?.let { request ->
            val grantedResources = mutableListOf<String>()
            if (cameraGranted && request.resources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                grantedResources.add(PermissionRequest.RESOURCE_VIDEO_CAPTURE)
            }
            if (audioGranted && request.resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)) {
                grantedResources.add(PermissionRequest.RESOURCE_AUDIO_CAPTURE)
            }

            if (grantedResources.isNotEmpty()) {
                request.grant(grantedResources.toTypedArray())
            } else {
                request.deny()
            }
        }
        pendingPermissionRequest = null
    }

    // Activity Result Launcher for Geolocation Permission
    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        pendingGeoCallback?.invoke(pendingGeoOrigin, isGranted, false)
        pendingGeoOrigin = null
        pendingGeoCallback = null
    }

    // Activity Result Launcher for Push Notification Permission (Android 13+)
    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { _ -> /* Optional: handle denied state */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        enableEdgeToEdge()

        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupEdgeToEdgePadding()

        networkMonitor = NetworkMonitor(this)
        downloadHandler = DownloadHandler(this)

        setupWebViewSettings()
        setupWebViewClients()
        setupSwipeRefresh()
        // Back press handled via onBackPressedDispatcher + onKeyDown
        setupBackPressedHandling()
        setupOfflineRetryButton()

        requestNotificationPermissionIfNeeded()

        if (networkMonitor.isConnected()) {
            showOfflineScreen(false)
            binding.webView.loadUrl(targetUrl)
        } else {
            showOfflineScreen(true)
        }
    }

    private fun setupEdgeToEdgePadding() {
        ViewCompat.setOnApplyWindowInsetsListener(binding.rootContainer) { _, insets ->
            val statusBars = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            val navBars = insets.getInsets(WindowInsetsCompat.Type.navigationBars())

            val params = binding.statusBarSpacer.layoutParams
            params.height = statusBars.top
            binding.statusBarSpacer.layoutParams = params

            binding.swipeRefreshLayout.setPadding(0, 0, 0, navBars.bottom)
            insets
        }
    }

    private fun setupWebViewSettings() {
        with(binding.webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            // Enable pop-ups (window.open, target="_blank", OAuth, payment windows)
            setSupportMultipleWindows(true)
            javaScriptCanOpenWindowsAutomatically = true

            // Security Best Practices
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

            // Caching & Performance
            cacheMode = WebSettings.LOAD_DEFAULT
            loadsImagesAutomatically = true
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        // Enable Cookies
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(binding.webView, true)

        // Add JS bridge so React Router can notify Android of navigation
        binding.webView.addJavascriptInterface(NavBridge(), "AndroidNav")

        // Enable Web Debugging in Debug builds only
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        // Setup File Download Listener
        binding.webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
            downloadHandler.downloadFile(url, userAgent, contentDisposition, mimetype)
        }
    }

    private fun setupWebViewClients() {
        binding.webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val uri = request?.url ?: return false
                val url = uri.toString()

                // Handle External Intent Protocols
                if (url.startsWith("mailto:") ||
                    url.startsWith("tel:") ||
                    url.startsWith("maps:") ||
                    url.startsWith("whatsapp:") ||
                    url.startsWith("intent:") ||
                    url.contains("wa.me/")
                ) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, uri)
                        startActivity(intent)
                    } catch (e: ActivityNotFoundException) {
                        Toast.makeText(this@MainActivity, "No app found to handle this link", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }

                // Keep akr-sm.vercel.app URLs inside app
                val targetHost = Uri.parse(targetUrl).host
                if (uri.host != null && uri.host.equals(targetHost, ignoreCase = true)) {
                    return false
                }

                // External HTTP/HTTPS links → open in browser
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, uri)
                        startActivity(intent)
                    } catch (e: Exception) {
                        return false
                    }
                    return true
                }

                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                binding.progressBar.visibility = View.VISIBLE
                if (networkMonitor.isConnected()) {
                    showOfflineScreen(false)
                }
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.progressBar.visibility = View.GONE
                binding.swipeRefreshLayout.isRefreshing = false

                // Seed the navStack with the initial page URL on first load
                if (navStack.isEmpty() && url != null) {
                    navStack.addLast(url)
                    android.util.Log.d("AKR_NAV", "INIT: $url")
                }

                // Inject JS bridge interceptor for React Router pushState.
                // Runs on every page load (idempotent via __akrBridgeInstalled flag).
                view?.evaluateJavascript("""
                    (function() {
                        if (window.__akrBridgeInstalled) return;
                        window.__akrBridgeInstalled = true;
                        var origPush = history.pushState.bind(history);
                        history.pushState = function(state, title, url) {
                            origPush(state, title, url);
                            try { window.AndroidNav.onPush(window.location.href); } catch(e) {}
                        };
                        window.addEventListener('popstate', function() {
                            try { window.AndroidNav.onPop(); } catch(e) {}
                        });
                    })();
                """.trimIndent(), null)
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true && !networkMonitor.isConnected()) {
                    showOfflineScreen(true)
                }
            }

            // doUpdateVisitedHistory fires for EVERY navigation:
            // full page loads, SPA pushState, SPA replaceState — everything.
            // We use this as the single source of truth for our back stack.
            override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                super.doUpdateVisitedHistory(view, url, isReload)
                if (url == null || isReload) return
                // If same URL as top of stack (replaceState), just update it
                if (navStack.isNotEmpty() && navStack.last() == url) return
                navStack.addLast(url)
                android.util.Log.d("AKR_NAV", "Stack push: $url | depth=${navStack.size}")
            }
        }

        binding.webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress == 100) {
                    binding.progressBar.visibility = View.GONE
                } else {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.progressBar.progress = newProgress
                }
            }

            // File Upload Support
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                if (takePictureIntent.resolveActivity(packageManager) != null) {
                    val photoFile: File? = try {
                        createImageFile()
                    } catch (ex: IOException) {
                        null
                    }

                    if (photoFile != null) {
                        cameraImageUri = FileProvider.getUriForFile(
                            this@MainActivity,
                            "${applicationContext.packageName}.fileprovider",
                            photoFile
                        )
                        takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri)
                    }
                }

                val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }

                val intentArray: Array<Intent> = if (cameraImageUri != null) {
                    arrayOf(takePictureIntent)
                } else {
                    emptyArray()
                }

                val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
                    putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
                    putExtra(Intent.EXTRA_TITLE, "Select File / Capture Photo")
                    putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
                }

                fileChooserLauncher.launch(chooserIntent)
                return true
            }

            // Camera & Microphone Permissions
            override fun onPermissionRequest(request: PermissionRequest?) {
                if (request == null) return
                pendingPermissionRequest = request

                val requestedResources = request.resources
                val neededPermissions = mutableListOf<String>()

                if (requestedResources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE) &&
                    ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
                ) {
                    neededPermissions.add(Manifest.permission.CAMERA)
                }

                if (requestedResources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE) &&
                    ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED
                ) {
                    neededPermissions.add(Manifest.permission.RECORD_AUDIO)
                }

                if (neededPermissions.isNotEmpty()) {
                    mediaPermissionLauncher.launch(neededPermissions.toTypedArray())
                } else {
                    request.grant(requestedResources)
                }
            }

            // Geolocation Permissions
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                pendingGeoOrigin = origin
                pendingGeoCallback = callback

                if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback?.invoke(origin, true, false)
                } else {
                    locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                }
            }

            /**
             * Handle pop-up windows (window.open, target="_blank", OAuth flows, payment gateways).
             * Opens pop-up in a full-screen dialog with its own WebView so it renders properly.
             */
            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message?
            ): Boolean {
                // Create a full-screen dialog to host the pop-up WebView
                val popupWebView = WebView(this@MainActivity).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.setSupportMultipleWindows(false)
                    CookieManager.getInstance().setAcceptThirdPartyCookies(this, true)
                }

                val dialog = Dialog(this@MainActivity, android.R.style.Theme_Black_NoTitleBar_Fullscreen)
                dialog.setContentView(popupWebView)
                dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)

                popupWebView.webChromeClient = object : WebChromeClient() {
                    override fun onCloseWindow(window: WebView?) {
                        dialog.dismiss()
                        window?.destroy()
                    }
                }

                popupWebView.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                        val url = request?.url?.toString() ?: return false
                        // If the popup is trying to navigate to main domain, load in main WebView
                        val targetHost = Uri.parse(targetUrl).host
                        if (request.url.host?.equals(targetHost, ignoreCase = true) == true) {
                            dialog.dismiss()
                            view?.destroy()
                            binding.webView.loadUrl(url)
                            return true
                        }
                        return false
                    }
                }

                // Connect the new window message transport
                val transport = resultMsg?.obj as? WebView.WebViewTransport
                transport?.webView = popupWebView
                resultMsg?.sendToTarget()

                dialog.show()
                return true
            }

            override fun onCloseWindow(window: WebView?) {
                super.onCloseWindow(window)
            }
        }
    }

    private fun setupSwipeRefresh() {
        // Swipe refresh gesture disabled to prevent accidental page reloads during scrolling
        binding.swipeRefreshLayout.isEnabled = false
    }

    private fun setupBackPressedHandling() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                navigateBack()
            }
        })
    }

    /**
     * Back navigation: calls window.androidBack() defined in the React app.
     * The React app returns true if it handled navigation (e.g. closed a modal, went to home),
     * or false if we're at the root and Android should close the app.
     */
    private fun navigateBack() {
        binding.webView.evaluateJavascript(
            "(function() { try { return window.androidBack ? window.androidBack() : false; } catch(e) { return false; } })()"
        ) { result ->
            val handled = result?.trim() == "true"
            android.util.Log.d("AKR_NAV", "androidBack() returned: $result | handled=$handled")
            if (!handled) {
                finish()
            }
        }
    }

    // Also intercept hardware KEYCODE_BACK for devices using button/gesture nav
    override fun onKeyDown(keyCode: Int, event: android.view.KeyEvent?): Boolean {
        if (keyCode == android.view.KeyEvent.KEYCODE_BACK) {
            navigateBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    private fun setupOfflineRetryButton() {
        binding.includedOfflineLayout.btnRetry.setOnClickListener {
            if (networkMonitor.isConnected()) {
                showOfflineScreen(false)
                binding.webView.loadUrl(targetUrl)
            } else {
                Toast.makeText(this, "Still offline. Please check your connection.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showOfflineScreen(show: Boolean) {
        binding.includedOfflineLayout.layoutOffline.visibility = if (show) View.VISIBLE else View.GONE
        binding.swipeRefreshLayout.visibility = if (show) View.GONE else View.VISIBLE
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("JPEG_${timeStamp}_", ".jpg", storageDir)
    }

    override fun onStart() {
        super.onStart()
        networkCallback = networkMonitor.startMonitoring(
            onAvailable = {
                runOnUiThread {
                    if (binding.includedOfflineLayout.layoutOffline.visibility == View.VISIBLE) {
                        showOfflineScreen(false)
                        binding.webView.loadUrl(targetUrl)
                    }
                }
            },
            onLost = { /* Optional: show offline screen immediately */ }
        )
    }

    override fun onStop() {
        super.onStop()
        networkCallback?.let { networkMonitor.stopMonitoring(it) }
    }

    override fun onPause() {
        super.onPause()
        binding.webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        binding.webView.onResume()
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.webView.destroy()
    }
}
