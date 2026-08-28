const CACHE_NAME = "wappenquiz-v11";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=12",
  "./app.js?v=12",
  "./data.js?v=12",
  "./icons.js?v=12",
  "./manifest.json?v=12",
  "./icons/icon-192.png?v=12",
  "./icons/icon-512.png?v=12",
  "./icons/icon-maskable-512.png?v=12",
  "./icons/apple-touch-icon.png?v=12",
  "./logos/bundesliga-icon.png",
  "./logos/2-bundesliga-icon.png",
  "./logos/Bundesliga/legenden.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Netzwerk zuerst, damit Updates (Design, neue Wappen, ...) sofort ankommen,
  // sobald online. Nur wenn kein Netz da ist, aus dem Cache bedienen –
  // dafür funktioniert die App trotzdem offline.
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
