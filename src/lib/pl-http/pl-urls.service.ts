import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PLUrlsService {
    urls: any = {};
    private urlsDefaults: any = {};
    private localStorageKey: string = 'plUrlsUrls';

    constructor() {
        this.formUrls();
    }

    setUrlsDefaults(urls: any) {
        this.urlsDefaults = urls;
    }

    formUrls() {
        // Check local storage first.
        let urlsLocalStorage = this.getFromLocalStorage();
        if (urlsLocalStorage) {
            this.urls = urlsLocalStorage;
        } else {
            this.urls = this.urlsDefaults;
        }
    }

    setUrls(urls: any) {
        this.urls = urls;
        this.setToLocalStorage();
    }

    getFromLocalStorage() {
        let urls = localStorage.getItem(this.localStorageKey);
        if (urls) {
            urls = JSON.parse(urls);
        }
        return urls;
    }

    setToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.urls));
    }

    clearFromLocalStorage() {
        localStorage.removeItem(this.localStorageKey);
    }

    getUrlKey(url: string) {
        for (let key in this.urls) {
            if (this.urls[key].indexOf(url) > -1) {
                return key;
            }
        }
        return '';
    }

    private removeScheme(url: string) {
        return url.replace(/http:\/\//, '').replace(/https:\/\//, '');
    }

    private removePort(url: string) {
        return url.replace(/:[0-9]{1,5}/, '');
    }

    isAppUrl(url: string) {
        let urlPart: string;
        for (let key in this.urls) {
            let urlPart = this.removeScheme(this.urls[key]);
            urlPart = this.removePort(urlPart);
            if (url.indexOf(urlPart) > -1) {
                return true;
            }
        }
        return false;
    }
}
