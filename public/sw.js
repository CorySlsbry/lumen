/*
 * Lumen service worker — minimal offline shell.
 *
 * Caches the app shell and serves it offline. API routes are network-first
 * with no caching (financial data must never be stale-served).
 */

const CACHE = "lumen-v1";
const APP_SHELL = [
  "/",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => null),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // Never cache API or auth — financial data must always be fresh.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    return;
  }
  // For navigation, network-first with cache fallback.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/dashboard")),
    );
    return;
  }
  // Static assets: cache-first.
  event.respondWith(
    caches.match(event.request).then((res) => res ?? fetch(event.request)),
  );
});
