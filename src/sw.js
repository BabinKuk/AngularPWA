const VERSION = 'v17';

log('Installing Service Worker');

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

async function installServiceWorker() {

    log("Service Worker installation started ");
    // download and install application files
    // in the browser (cache storage)
    const cache = await caches.open(getCacheName());

    // immediately activate new sw version
    // use with caution, app can be served with different sw versions
    // can cause bugs and inconsistent scenarios
    self.skipWaiting();

    return cache.addAll([
        '/',
        '/polyfills.bundle.js',
        '/inline.bundle.js',
        '/styles.bundle.js',
        '/vendor.bundle.js',
        '/main.bundle.js',
        //'/api/lessons', // data
        '/assets/bundle.css',
        '/assets/angular-pwa-course.png',
        '/assets/main-page-logo-small-hat.png'
    ]);
}

self.addEventListener('activate', () => activateSW());

async function activateSW() {

    log('Service Worker activated');
    // delete previous cache versions after new sw is activated
    const cacheKeys = await caches.keys();

    cacheKeys.forEach(cacheKey => {
        if (cacheKey !== getCacheName() ) {
            caches.delete(cacheKey);
        }
    });

    // activate this version for all active browser tabs
    // early activation!!
    return clients.claim();
}

// triggered on every http request
self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));

async function cacheThenNetwork(event) {
    log('Intercepting request: ' + event.request.url);
    // open the cache
    const cache = await caches.open(getCacheName());
    // get the response
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('From Cache: ' + event.request.url);
        return cachedResponse;
    }
    // if there is no response from cache, get network response
    const networkResponse = await fetch(event.request);

    log('Calling network: ' + event.request.url);

    return networkResponse;
}

function getCacheName() {
    return "app-cache-" + VERSION;
}

function log(message, ...data) {
    if (data.length > 0) {
        console.log(VERSION, message, data);
    }
    else {
        console.log(VERSION, message);
    }
}
