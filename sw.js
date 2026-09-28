// Service worker : garde les fichiers de l'app en cache pour qu'elle s'ouvre
// même avec une connexion faible ou absente.
// ⚠️ Change le numéro de VERSION à chaque mise à jour de l'app,
// sinon les téléphones garderont l'ancienne version.
const VERSION = "sono-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/app.js",
  "./js/config.js",
  "./js/data.js",
  "./js/store.js",
  "./js/util.js",
  "./js/views/check.js",
  "./js/views/pannes.js",
  "./js/views/historique.js",
  "./js/views/reglages.js",
  "./js/views/infos.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fichiers de l'app : réseau d'abord (pour avoir la dernière version), cache si hors ligne.
// Les appels à Supabase ne passent pas par le cache.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
