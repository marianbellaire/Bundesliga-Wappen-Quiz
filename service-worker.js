const CACHE_NAME = "wappenquiz-v29";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=30",
  "./app.js?v=30",
  "./data.js?v=30",
  "./icons.js?v=30",
  "./manifest.json?v=30",
  "./icons/icon-192.png?v=30",
  "./icons/icon-512.png?v=30",
  "./icons/icon-maskable-512.png?v=30",
  "./icons/apple-touch-icon.png?v=30",
  "./logos/ball-icon.png",
  "./audio/phrases/richtig.mp3",
  "./audio/phrases/falsch.mp3",
  "./logos/bundesliga-icon.png",
  "./logos/2-bundesliga-icon.png",
  "./logos/3-liga-icon.png",
  "./logos/International/real-madrid-logo-footylogos.png",
  "./logos/Legenden/beckenbauer.png"
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
