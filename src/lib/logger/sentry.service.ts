import * as Sentry from '@sentry/browser';
import { ErrorHandler } from '@angular/core';

// TODO - un-hardcode the relative path here.
import { environment } from '../../environments/environment';

Sentry.init({
    dsn: environment.sentry_key,
    release: environment.git_sha,
    ignoreErrors: [
        // use string or regex.use string for 'partial matches
        'ResizeObserver loop limit exceeded', // see https://stackoverflow.com/a/50387233/560585
        'Non-Error promise rejection captured with keys: isTrusted', // PL-2472
    ],
});

export class SentryErrorHandler implements ErrorHandler {
    // handleError will automatically be called whenever an error goes uncaught
    handleError(err: any): void {
        Sentry.captureException(err.originalError);
    }

    // inject the SentryErrorHandler service in a component in order
    // to call captureMessage
    captureMessage(message: string): void {
        Sentry.captureMessage(message);
    }
}
