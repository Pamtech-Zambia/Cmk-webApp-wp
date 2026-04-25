// Simple PWA service worker for CMK Baking
// Strategy:
// - Precache the offline shell on install
// - Network-first for HTML navigations, falling back to cached shell when offline
// - Stale-while-revalidate for same-origin static assets (CSS/JS/images/fonts)
// - Never cache API or admin routes

const CACHE_VERSION = "cmk-v1"
const OFFLINE_URL = "/offline.html"
const PRECACHE_URLS = [OFFLINE_URL, "/icon-192.jpg", "/icon-512.jpg"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => null),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

function isCacheableAsset(url) {
  return (
    url.origin === self.location.origin &&
    !url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/cmk") &&
    (url.pathname.startsWith("/_next/static/") ||
      /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|webp|svg|ico)$/i.test(url.pathname))
  )
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)

  // Don't intercept admin or API — always go to network
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/cmk")) {
    return
  }

  // HTML navigations: network-first, fallback to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r || Response.error()),
      ),
    )
    return
  }

  // Static assets: stale-while-revalidate
  if (isCacheableAsset(url)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res && res.status === 200) cache.put(request, res.clone())
              return res
            })
            .catch(() => cached)
          return cached || network
        }),
      ),
    )
  }
})
