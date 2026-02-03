# PWA with Astro – Quick Reference

Use [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro.html) (Vite PWA Astro integration). This is the only guide you need; the general Vite PWA guide is for vanilla Vite.

---

## 1. Install

```bash
pnpm add -D @vite-pwa/astro
# or: npm install -D @vite-pwa/astro
```

---

## 2. Astro config

Add **AstroPWA as an integration** (not a Vite plugin).

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://your-site.com', // required for manifest URLs
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',        // or 'prompt' to ask user to reload on update
      devOptions: { enabled: true },     // generate manifest + SW in dev
      manifest: {
        name: 'Your App',
        short_name: 'Your App',
        description: 'Your app description',
        theme_color: '#008E48',
        background_color: '#ffffff',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
});
```

**Optional:** `workbox.navigateFallback: '/404'` if you have a 404 page for SPA-style fallback.

---

## 3. Layout – manifest link + service worker

In your **main layout** (e.g. `src/layouts/BaseLayout.astro`):

**In `<head>`:** inject the web manifest link (use `Fragment` **without** importing it – it’s a global in Astro).

```astro
---
import { pwaInfo } from 'virtual:pwa-info';
---
<head>
  <!-- your existing head content -->
  {pwaInfo && <Fragment set:html={pwaInfo.webManifest.linkTag} />}
</head>
```

**In `<body>`:** register the service worker (so the SW is installed and can cache).

```astro
<body>
  <!-- your content -->
  <script>
    import { registerSW } from 'virtual:pwa-register';
    registerSW({
      immediate: true,
      onRegisteredSW(swScriptUrl) { /* optional */ },
      onOfflineReady() { /* optional */ },
    });
  </script>
</body>
```

**Important:** Do **not** `import { Fragment } from 'astro'`. `Fragment` is a global in `.astro` files; importing it can make it `undefined` and break the manifest link.

---

## 4. Build output

After `astro build` you get:

- `dist/manifest.webmanifest` – web app manifest
- `dist/sw.js` – service worker
- `dist/workbox-*.js` – Workbox runtime

The app is installable and works offline (precache).

---

## 5. Optional: custom “Install app” banner

The browser’s **install** prompt (“Add to Home Screen”) is controlled by the browser. To show your own “Install” button:

1. Listen for the `beforeinstallprompt` event.
2. Store the event and show a banner/button.
3. On button click, call `storedEvent.prompt()` then `await storedEvent.userChoice`.

Minimal pattern:

```astro
<!-- InstallPrompt.astro -->
<div id="install-prompt" hidden>
  <p>Install this app</p>
  <button id="install-accept">Install</button>
  <button id="install-dismiss">Not now</button>
</div>

<script>
  let deferredPrompt = null;
  const banner = document.getElementById('install-prompt');
  const accept = document.getElementById('install-accept');
  const dismiss = document.getElementById('install-prompt-dismiss');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (banner) banner.hidden = false;
  });

  accept?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (banner) banner.hidden = true;
  });

  dismiss?.addEventListener('click', () => {
    if (banner) banner.hidden = true;
  });
</script>
```

Include the component in your layout. Give the banner an **opaque background** (e.g. `background-color: #008E48` or `var(--p, #008E48)`) so it doesn’t sit transparent over content.

---

## 6. Optional: “New content available” (reload prompt)

If you use `registerType: 'prompt'` instead of `'autoUpdate'`, the SW won’t take over until the user reloads. You can show a “New content available, reload?” toast:

- In `registerSW()`, use the callback `onNeedRefresh()`.
- Store the reload function returned by `registerSW()` and call it when the user clicks “Reload”.

See [Vite PWA – Prompt for update](https://vite-pwa-org.netlify.app/frameworks/astro.html#prompt-for-update) for the full ReloadPrompt pattern.

---

## 7. Checklist

| Step | What |
|------|------|
| 1 | `pnpm add -D @vite-pwa/astro` |
| 2 | Add `AstroPWA({ ... })` to `integrations` in `astro.config.mjs` (not in `vite.plugins`) |
| 3 | In layout head: `{ pwaInfo && <Fragment set:html={pwaInfo.webManifest.linkTag} /> }` (no Fragment import) |
| 4 | In layout body: script that imports `registerSW` from `virtual:pwa-register` and calls it with `immediate: true` |
| 5 | (Optional) Add an InstallPrompt component and opaque styles for the banner |

---

## 8. References

- **Astro + PWA:** https://vite-pwa-org.netlify.app/frameworks/astro.html  
- **Vite PWA guide (concepts):** https://vite-pwa-org.netlify.app/guide/
