const CACHE = "savory-v1";
const urlsToCache = ["/", "/offline"];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event: any) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((r) => r || caches.match("/offline"))
    )
  );
});

self.addEventListener("push", (event: any) => {
  let data = { title: "Savory", body: "¡Tenemos novedades para ti!", icon: "/icon-192.svg" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icon-192.svg",
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});
