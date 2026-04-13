// ==UserScript==
// @name         Moodle forcedownload fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrites Moodle links so forcedownload=1 becomes forcedownload=0
// @author       @choppadebug (https://github.com/choppadebug)
// @match        *://*/*
// @run-at       document-start
// @icon         https://moodle.org/theme/moodleorg/pix/moodle_logo_TM.svg
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  function shouldHandleHost() {
    return /moodle|elearning|icorsi/i.test(location.hostname) || true;
  }

  function rewriteRawUrl(rawUrl) {
    if (!rawUrl) return null;

    try {
      const url = new URL(rawUrl, location.href);

      const isPluginFile = /\/pluginfile\.php\b/.test(url.pathname);
      const hasForce = url.searchParams.has('forcedownload');

      if (!isPluginFile && !hasForce) return null;

      if (url.searchParams.get('forcedownload') === '1') {
        url.searchParams.set('forcedownload', '0');
        return url.toString();
      }

      return null;
    } catch {
      return null;
    }
  }

  function patchAnchor(a) {
    if (!(a instanceof HTMLAnchorElement)) return false;

    const rawAttr = a.getAttribute('href');
    const rewritten = rewriteRawUrl(rawAttr || a.href);
    if (!rewritten) return false;

    if (rawAttr !== rewritten) {
      a.setAttribute('href', rewritten);
      a.href = rewritten;
    }
    return true;
  }

  function patchNode(root) {
    if (!(root instanceof Element || root instanceof Document)) return;

    if (root instanceof HTMLAnchorElement) patchAnchor(root);
    root.querySelectorAll?.('a[href]').forEach(patchAnchor);
  }

  function patchClick(e) {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    patchAnchor(a);
  }

  function patchWindowOpen() {
    const originalOpen = window.open;
    window.open = function(url, ...rest) {
      const rewritten = typeof url === 'string' ? rewriteRawUrl(url) : null;
      return originalOpen.call(this, rewritten || url, ...rest);
    };
  }

  if (!shouldHandleHost()) return;

  document.addEventListener('click', patchClick, true);
  patchWindowOpen();

  const start = () => {
    patchNode(document);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          patchNode(node);
        }
        if (m.type === 'attributes' && m.target instanceof HTMLAnchorElement) {
          patchAnchor(m.target);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
  };

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();