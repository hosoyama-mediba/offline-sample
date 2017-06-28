const cacheId = '<% chacheId %>';
const fallbackUrl = `offline.html?_cc=${cacheId}`;

// Service Workerのインストール時
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheId)
        // 定義したファイルを全てキャッシュする
        .then(cache => cache.addAll([fallbackUrl]))
        // すぐにアクティベートする
        .then(() => self.skipWaiting()),
    );
});

// Service Workerがアクティブになった時
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // 古いキャッシュを削除する
        caches.keys()
        .then(keys => Promise.all(
            keys.map((key) => {
                if (key !== cacheId) {
                    return caches.delete(key);
                }
                return undefined;
            }),
        ))
        // すぐに全てのページをコントロール可能にする
        .then(() => self.clients.claim()),
    );
});

// 通信時
self.addEventListener('fetch', (event) => {
    // オフラインの時にキャッシュされたfallbackUrlのレスポンスを返す
    // 実際はキャッシュがない時だけリダイレクトするのがよい
    // sw-precacheを使うと柔軟な設定ができる
    if (!navigator.onLine) {
        event.respondWith(caches.match(fallbackUrl));
    }
});
