const cacheId = '<% chacheId %>';
const fallbackUrl = `offline.html?_cc=${cacheId}`;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheId)
        .then(cache => cache.addAll([fallbackUrl]))
        .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
        .then(keys => Promise.all(
            keys.map((key) => {
                if (key !== cacheId) {
                    return caches.delete(key);
                }
                return undefined;
            }),
        ))
        .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    if (!navigator.onLine) {
        event.respondWith(caches.match(fallbackUrl));
    }
});
