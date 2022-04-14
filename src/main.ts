import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

/**
 * As of Angular v6, preserveWhitespaces defaults to false. Override that option
 * for JIT compiling until we can remove our implicit dependency on this behavior.
 * (see tsconfig.app.json for AOT).
 */
platformBrowserDynamic().bootstrapModule(AppModule, { preserveWhitespaces: true });
