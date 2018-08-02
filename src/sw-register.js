

// check if browser supports sw
if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/sw.js', {
        scope: '/' // intercept all http requests
    })
    .then(registration => {
        console.log('Service worker registration completed');
    });
}
