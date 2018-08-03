import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// register sw after angular app finish bootstraping itself
platformBrowserDynamic().bootstrapModule(AppModule)
    .then(() => {
        // check if browser has sw support
        if ('serviceWorker' in navigator) {

            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            })
            .then(registration => {

                console.log('Service worker registration completed');

                // manually check for new sw version (after 60s)
                setInterval(() => {

                    console.log('Updating Service Worker ...');
                    registration.update();

                }, 60000);

            });
        }

    });
