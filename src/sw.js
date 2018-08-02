const VERSION = 'v8';

log('Installing Service Worker');

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

self.addEventListener('activate', () => {
  log('version is activated');
});

//triggered every time app issues http request eligible for interception
self.addEventListener('fetch', event => event.respondWith(showOfflineIfError(event)));

async function installServiceWorker() {

    log("Service Worker installation started ");

    // fetch offline file
    const request = new Request('offline.html');
    // execute request and assign it to response
    const response = await fetch(request);

    log("response received after loading offline.html", response);

    if (response.status !== 200) {
        throw new Error('Could not load offline page!');
    }
    // open the cache and store offline page
    const cache = await caches.open('app-cache');
    cache.put(request, response);

    log("Cached offline.html");
}

async function showOfflineIfError(event) {

    let response;

    try {
        log('Calling network: ' + event.request.url);
        response = await fetch(event.request);
    }
    catch(err) {
        log( 'Network request Failed. Serving offline page ', err );
        // open the cache and fetch offline page stored inside cache
        const cache = await caches.open('app-cache');
        response = cache.match("offline.html");
    }

    return response;
}

function log(message, ...data) {
    //if (data.length > 0) {
        console.log(VERSION, message, data);
    //}
    //else {
    //    console.log(message);
    //}
}
