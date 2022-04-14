/**
TODO: Make sure (with tests) that one cannot hijack the code and send
 a request to an arbitrary host (from which they could then steal your session).
 See Angular 1 implementation for how this was done) and for some test cases.

3 tasks:
1. On first (login / status) request store the token for future use.
2. Add a header "Authorization: JWT <token>" to all outgoing requests to our server
3. If request to our server comes back with 401, retry fetching the token.
    1. If fetching the token comes back with 401, redirect to login page, else retry request with new token.
*/

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';


import { PLUrlsService } from './pl-urls.service';
import { PLWindowService } from '../pl-window';

let tokenCopy: string = '';
export function getToken() {
    return tokenCopy;
}

@Injectable({ providedIn: 'root' })
export class PLHttpAuthService {
    token: string = '';
    maxRetries: number = 1;

    constructor(private plUrls: PLUrlsService, private plWindow: PLWindowService) {}

    getToken(response: any, url: string) {
        const urlKey = this.plUrls.getUrlKey(url);
        if (urlKey === 'status' && response.token) {
            this.token = response.token;
            tokenCopy = this.token;
            return this.token;
        }
        return '';
    }

    // getCypressToken() {
    //     const cypress = window._cypress;
    //     if (cypress && cypress.sessionId && cypress.csrfToken && cypress.jwtToken) {
    //         this.token = cypress.jwtToken;
    //         return true;
    //     }
    //     return false;
    // }

    addToken(url: string, requestOptions: any, customToken: string = null) {
        const token = customToken ? customToken : this.token;
        if (token && this.isAddTokenUrl(url)) {
            if (!requestOptions.headers) {
                requestOptions.headers = new HttpHeaders({
                    Authorization: `JWT ${token}`,
                });
            } else {
                requestOptions.headers['Authorization'] = `JWT ${token}`;
            }
        }
        return requestOptions;
    }

    private isAddTokenUrl(url: string) {
        return this.plUrls.isAppUrl(url);
    }

    assumeLogin(email: string): void {
        this.redirectTo(`${this.plUrls.urls.assumeLogin}${encodeURIComponent(email)}/`);
    }

    releaseLogin(): void {
        this.redirectTo(this.plUrls.urls.releaseLogin);
    }

    redirectTo(url: string) {
        this.plWindow.location.href = url;
    }

    login() {
        this.redirectTo(`${this.plUrls.urls.login}?next=${this.plWindow.location.href}`);
    }

    logout() {
        const baseUrl = this.plWindow.location.href.slice(0, this.plWindow.location.href.indexOf('/logout'));
        const redirectUrl = `${baseUrl}/`;
        this.redirectTo(`${this.plUrls.urls.logout}?next=${redirectUrl}`);
    }

    shouldRetry(err: any, attemptNumber: number, url: string) {
        const urlKey = this.plUrls.getUrlKey(url);
        if (urlKey !== 'status' && attemptNumber < this.maxRetries && err.status && err.status === 401) {
            return true;
        }
        return false;
    }

    // Circular dependency issue on plHttp if put rety here. So moved to plHttp.
}
