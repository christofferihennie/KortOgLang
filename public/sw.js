// Bump this when changing cache behavior so old caches get cleaned up.
const CACHE_VERSION = "kort-og-lang-v1"
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

// Files that should be available immediately for install/offline shell usage.
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/robots.txt",
  "/favicon.ico",
  "/apple-icon.png",
  "/icon1.png",
  "/manifest-icon-192.maskable.png",
  "/manifest-icon-512.maskable.png",
  "/startup/apple-splash-1125-2436.jpg",
  "/startup/apple-splash-1136-640.jpg",
  "/startup/apple-splash-1170-2532.jpg",
  "/startup/apple-splash-1179-2556.jpg",
  "/startup/apple-splash-1206-2622.jpg",
  "/startup/apple-splash-1242-2208.jpg",
  "/startup/apple-splash-1242-2688.jpg",
  "/startup/apple-splash-1284-2778.jpg",
  "/startup/apple-splash-1290-2796.jpg",
  "/startup/apple-splash-1320-2868.jpg",
  "/startup/apple-splash-1334-750.jpg",
  "/startup/apple-splash-1488-2266.jpg",
  "/startup/apple-splash-1536-2048.jpg",
  "/startup/apple-splash-1620-2160.jpg",
  "/startup/apple-splash-1640-2360.jpg",
  "/startup/apple-splash-1668-2224.jpg",
  "/startup/apple-splash-1668-2388.jpg",
  "/startup/apple-splash-1792-828.jpg",
  "/startup/apple-splash-2048-1536.jpg",
  "/startup/apple-splash-2048-2732.jpg",
  "/startup/apple-splash-2160-1620.jpg",
  "/startup/apple-splash-2208-1242.jpg",
  "/startup/apple-splash-2224-1668.jpg",
  "/startup/apple-splash-2266-1488.jpg",
  "/startup/apple-splash-2360-1640.jpg",
  "/startup/apple-splash-2388-1668.jpg",
  "/startup/apple-splash-2436-1125.jpg",
  "/startup/apple-splash-2532-1170.jpg",
  "/startup/apple-splash-2556-1179.jpg",
  "/startup/apple-splash-2622-1206.jpg",
  "/startup/apple-splash-2688-1242.jpg",
  "/startup/apple-splash-2732-2048.jpg",
  "/startup/apple-splash-2778-1284.jpg",
  "/startup/apple-splash-2796-1290.jpg",
  "/startup/apple-splash-2868-1320.jpg",
  "/startup/apple-splash-640-1136.jpg",
  "/startup/apple-splash-750-1334.jpg",
  "/startup/apple-splash-828-1792.jpg",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      // Force a network fetch during install so the cache gets fresh copies.
      .then((cache) =>
        cache.addAll(
          PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" }))
        )
      )
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      // Remove caches from older service worker versions.
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("message", (event) => {
  // Allow the page to promote a newly installed worker immediately.
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Only handle same-origin GET requests.
  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  // Leave API traffic alone so auth and dynamic server responses stay fresh.
  if (url.pathname.startsWith("/api/")) {
    return
  }

  // HTML navigations prefer the network but fall back to cache offline.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets can return cached content immediately while refreshing.
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.startsWith("/assets/")
  ) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request))
  }
})

async function cacheFirst(request) {
  // Best for app metadata and splash/icon assets that rarely change.
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(request)
  const cache = await caches.open(STATIC_CACHE)
  cache.put(request, response.clone())
  return response
}

async function networkFirst(request) {
  // Best for navigations so users get fresh pages when online.
  const cache = await caches.open(RUNTIME_CACHE)

  try {
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch {
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return (await caches.match("/")) || Response.error()
  }
}

async function staleWhileRevalidate(request) {
  // Best for static assets where fast paint matters more than perfect freshness.
  const cache = await caches.open(RUNTIME_CACHE)
  const cachedResponse = await cache.match(request)

  const networkResponsePromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await networkResponsePromise
  return networkResponse || Response.error()
}
