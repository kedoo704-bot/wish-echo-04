const CACHE_VERSION = "kehdoo-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/brand/favicon-32.png",
  "/brand/icon-192.png",
  "/brand/icon-512.png",
  "/brand/maskable-icon-512.png",
  "/brand/main-logo-lockup.png",
  "/brand/og-image.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isSupabase = url.hostname.includes("supabase.co") || url.hostname.includes("supabase.in");
  if (isSupabase) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/"));
    return;
  }

  if (isSameOrigin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || cache.match(fallbackUrl);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

// "Notify me when they open it" — see src/lib/push-client.ts (subscribe)
// and src/lib/push-server.ts (send). The payload is plain JSON, not
// encrypted app data, so no card content ever passes through this.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // Non-JSON payload — fall back to the defaults below.
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Kehdoo", {
      body: data.body || "",
      icon: "/brand/icon-192.png",
      badge: "/brand/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
