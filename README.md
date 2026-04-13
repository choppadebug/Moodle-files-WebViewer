Moodle Files WebViewer
======================

Simple **Tampermonkey userscript** that prevents Moodle from forcing file downloads (e.g. PDFs) and instead opens them directly in the browser.

It works by rewriting URLs where `forcedownload=1` → `forcedownload=0`.

* * * * *

✨ Features
----------

-   Automatically intercepts Moodle file links
-   Rewrites download-forcing URLs in real-time
-   Works on dynamically loaded content
-   Handles:
    -   Normal links
    -   Click events
    -   `window.open()` calls

* * * * *

📦 Requirements
---------------

You need a userscript manager:

👉 **Tampermonkey**

### Install Tampermonkey

-   Official website: <https://www.tampermonkey.net/>
-   Browser stores:
    -   Chrome / Edge → Chrome Web Store
    -   Firefox → Add-ons Marketplace
    -   Safari → App Store

Follow the installation instructions on their website.

* * * * *

🚀 Installation
---------------

1.  Install **Tampermonkey**
2.  Open the Tampermonkey dashboard
3.  Click **"Create a new script"**
4.  Replace the default content with the script:

    Moodle_forcedownload_fixer-1.0.user.js

5.  Save (`Ctrl + S`)

* * * * *

✅ How to Verify It Works
------------------------

After installation:

1.  Go to your Moodle platform (e.g. a course page)
2.  Click on a PDF or file link
3.  If everything is working:
    -   ✅ The file opens in your browser
    -   ❌ It does NOT download automatically

### Debug tips

-   Open browser DevTools → Network tab
-   Check that URLs now contain:

    forcedownload=0

-   You can also inspect links (`Right click → Copy link`) to confirm rewriting

* * * * *

🌍 Supported Platforms (Tested)
-------------------------------

Currently tested on:

-   `elearning.unimib.it`
-   `icorsi.ch`

These are based on **Moodle**.

* * * * *

⚠️ Domain Support
-----------------

Right now, the script **runs on all websites**, but it is only *verified* on Moodle-based platforms.

### Add Your Own Moodle Domain

You can restrict or customize the script by editing this function:

```javascript
function shouldHandleHost() {\
  return /moodle|elearning|icorsi/i.test(location.hostname) || true;\
}
```

### Example: limit to your university

```javascript
function shouldHandleHost() {\
  return /yourdomain\.edu/i.test(location.hostname);\
}
```

### Example: add another Moodle instance

```javascript
function shouldHandleHost() {\
  return /moodle|elearning|icorsi|yourdomain/i.test(location.hostname);\
}
```

* * * * *

🛠️ How It Works (Technical)
----------------------------

The script:

-   Detects links to:
    -   `/pluginfile.php`
    -   URLs containing `forcedownload`
-   Rewrites:

    forcedownload=1 → forcedownload=0

-   Hooks into:
    -   DOM mutations
    -   Click events
    -   `window.open`

* * * * *

📌 Notes
--------

-   Works best with PDFs and browser-supported file types
-   Behavior may vary depending on browser settings
-   Some Moodle configurations might override this behavior

* * * * *

👤 Author
---------

Created by **@choppadebug**\
GitHub: <https://github.com/choppadebug>