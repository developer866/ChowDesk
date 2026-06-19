// public/sw.js
// Manual service worker — no next-pwa dependency needed.
// Caches key pages and assets for offline use.

const CACHE_NAME = "chowdesk-v1";

const STATIC_ASSETS = [
  "/",
  "/foodspage",
  "/cart",
  "/orders",
  "/about",
  "/manifest.json",
];

// ── INSTALL — cache static assets ──────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE — clean up old caches ─────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH — serve from cache, fallback to network ──────────
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and API calls (always fetch fresh)
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache successful page responses
          if (
            response.ok &&
            response.type === "basic" &&
            !event.request.url.includes("_next/static")
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback — return homepage from cache
          return caches.match("/");
        });
    })
  );
});