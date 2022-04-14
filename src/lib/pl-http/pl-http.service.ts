import { HttpClient, HttpHeaders, HttpParameterCodec,
 HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


import { PLUrlsService } from './pl-urls.service';
import { PLHttpAuthService } from './pl-http-auth.service';
import { PLHttpErrorService } from './pl-http-error.service';
import { PLLodashService } from '../pl-lodash';
import { PLToastService } from '../pl-toast';

@Injectable()
export class PLHttpService {
    constructor(
        private plUrls: PLUrlsService,
        private http: HttpClient,
        private plHttpAuth: PLHttpAuthService,
        private plHttpError: PLHttpErrorService,
        private plToast: PLToastService,
        private plLodash: PLLodashService
    ) {}

    private requestMap = {};

    formUrl(urlKey: string, url: string = '') {
        if (url) {
            return url;
        }
        return urlKey && this.plUrls.urls[urlKey] ? this.plUrls.urls[urlKey] : '';
    }

    private handleError(err: any, url: string, options: any = { suppressError: false }) {
        console.log(`--- Application plHttp error ${err.status || ''}`, err);

        if (err.status === 502 && localStorage.getItem('PL_SUPPRESS_502')) {
            return;
        }

        if (!options.suppressError) {
            const message = this.plHttpError.get(url, err.status, err);
            this.plToast.show('error', message);
        }
    }

    retryAuth(
        errOriginal: any,
        httpOpts: any,
        urlKey: string,
        options: any = {},
        attemptNumber: number = 0,
        observer1: any = null,
        observable1: any = null
    ) {
        return new Observable((observer: any) => {
            if (this.plHttpAuth.shouldRetry(errOriginal, attemptNumber, httpOpts.url)) {
                this.get('status', { withCredentials: true }).subscribe(
                    (res: any) => {
                        if (res.user) {
                            // Try original call again.
                            observer.next({});
                            observer.complete();
                            this.go(httpOpts, urlKey, options, attemptNumber + 1, observer1, observable1);
                        } else {
                            observer.error(res);
                            this.plHttpAuth.login();
                        }
                    },
                    (err: any) => {
                        observer.error(err);
                        this.plHttpAuth.login();
                    }
                );
            } else {
                observer.error();
            }
        });
    }

    private addRequest(requestInfo) {
        this.requestMap[requestInfo.key] = 1;
    }

    private removeRequest(requestInfo) {
        const KEY = requestInfo.key;
        const TIMESTAMP = requestInfo.timestamp;
        const obj = this.requestMap[KEY];
        delete this.requestMap[KEY];
        const COUNT = Object.keys(this.requestMap).length;
        const NOW = Date.now();
        const DURATION = NOW - TIMESTAMP;
        localStorage.setItem('PL_LAST_REST_COUNT', `${COUNT}`);
        localStorage.setItem('PL_LAST_REST_TIME', `${NOW}`);
        const removed = !obj;
        const {query, method} = requestInfo;
        const info: any = { COUNT, DURATION, KEY, query, method };
        if (requestInfo.error) {
            info.error = requestInfo.error;
        }
        if (requestInfo.response) {
            info.response = requestInfo.response;
        }
        if (localStorage.getItem('PL_API_DEBUG')) {
            console.log(`REST API - ${method} ${query} ${removed ? '💠 (removed)' : ''}`, info);
        }
    }

    /**
    We only want to return ONE observable, right away on the first attempt.
     After that, we just need to update the existing observer.
    */
    go(
        httpOpts: any,
        urlKey: string = '',
        options: any = {},
        attemptNumber: number = 0,
        observer1: any = null,
        observable1: any = null
    ) {
        const observable = new Observable((observer: any) => {
            const observerToUse = observer1 ? observer1 : observer;
            const observableToUse = observable1 ? observable1 : observable;
            httpOpts.url = this.formUrl(urlKey, httpOpts.url);

            if (!httpOpts.url) {
                observerToUse.error('One of valid urlKey or httpOpts.url is required');
            } else {
                const customToken = options && options.jwtToken ? options.jwtToken : null;
                httpOpts = this.plHttpAuth.addToken(httpOpts.url, httpOpts, customToken);

                // For unit testing.
                if (options.xName) {
                    if (!httpOpts.headers) {
                        httpOpts.headers = new HttpHeaders();
                    }
                    httpOpts.headers = httpOpts.headers.append('xName', options.xName);
                }

                const url = httpOpts.url;
                const pathIndex = url.indexOf('/api/');
                const requestInfo: any = {
                    key: `${Math.random()}`,
                    timestamp: Date.now(),
                    query: `${url.substring(pathIndex === -1 ? 0 : pathIndex)}`,
                    method: `${httpOpts.method}`,
                };
                this.addRequest(requestInfo);

                this.http
                    .request(httpOpts.method, httpOpts.url, httpOpts)
                    // May get empty / non JSON response.
                    // .map((res: any) => res.json())
                    .subscribe(
                        (res: any) => {
                            requestInfo.response = res;
                            this.removeRequest(requestInfo);
                            let resToSend: any;
                            try {
                                resToSend = res;
                                this.plHttpAuth.getToken(resToSend, httpOpts.url);
                            } catch (e) {
                                resToSend = res;
                            }
                            observerToUse.next(resToSend);
                            observerToUse.complete();
                        },
                        (err: any) => {
                            requestInfo.error = err;
                            this.removeRequest(requestInfo);
                            // Needed to copy, otherwise it would get over-written
                            // when try to access it later to send back.
                            const errCopy = this.plLodash.copy(err);
                            // Token may have expired - may need to try again
                            this.retryAuth(
                                err,
                                httpOpts,
                                urlKey,
                                options,
                                attemptNumber,
                                observerToUse,
                                observableToUse
                            ).subscribe(
                                (resRetry: any) => {
                                    // Original observer will be completed on the retry call,
                                    // so do nothing here.
                                    // observerToUse.complete();
                                },
                                (errRetry: any) => {
                                    this.handleError(errCopy, httpOpts.url, options);
                                    try {
                                        observerToUse.error(errCopy);
                                    } catch (error) {
                                        // catch the error thrown by Observer.error() since we've already done our handling
                                        // otherwise, this will get dumped to the console and to Sentry
                                    }
                                }
                            );
                        }
                    );
            }
        });
        // Observerables do not run until subscribed to so we need to trigger this
        // if not the first time.
        // Ignore result though, it will be handled above.
        if (observable1) {
            observable.subscribe((res: any) => {});
        }
        return observable1 ? observable1 : observable;
    }

    private addCredentials(httpOpts: any, data: any) {
        if (data.withCredentials) {
            httpOpts.withCredentials = data.withCredentials;
        }
        return httpOpts;
    }

    private setUrlParams(data: any) {
        // let atLeastOne = false;

        // // https://github.com/angular/angular/issues/11058#issuecomment-351864976
        // // A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
        // // serialize and parse URL parameter keys and values.
        class WebHttpUrlEncodingCodec implements HttpParameterCodec {
          encodeKey(k: string): string { return encodeURIComponent(k); }

          encodeValue(v: string): string { return encodeURIComponent(v); }

          decodeKey(k: string): string { return decodeURIComponent(k); }

          decodeValue(v: string) { return decodeURIComponent(v); }
        }
        let params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });
        // let params = new HttpParams();

        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key].forEach((param: any) => {
                    params = params.append(key, param);
                });
            } else {
                params = params.append(key, data[key]);
            }
            // atLeastOne = true;
        }
        return params;
    }

    private setUrl(urlKey: string, data: any, url1: string = '') {
        let url: string;
        if (url1) {
            url = url1;
        } else {
            url = data.uuid ? `${this.formUrl(urlKey, url1)}${data.uuid}/` : null;
        }
        return url;
    }

    put(urlKey: string, data: any, url1: string = '', options: any = {}) {
        let httpOpts = {
            method: 'PUT',
            url: this.setUrl(urlKey, data, url1),
            body: data,
        };
        httpOpts = this.addCredentials(httpOpts, data);
        return this.go(httpOpts, urlKey, options);
    }

    save(urlKey: string, data: any, url1: string = '', options: any = {}) {
        let httpOpts = {
            method: data.uuid ? 'PATCH' : 'POST',
            url: this.setUrl(urlKey, data, url1),
            body: data,
        };
        httpOpts = this.addCredentials(httpOpts, data);
        return this.go(httpOpts, urlKey, options);
    }

    get(urlKey: string, data: any = {}, url1: string = '', options: any = {}) {
        let httpOpts = {
            method: 'GET',
            url: this.setUrl(urlKey, data, url1),
            params: this.setUrlParams(data),
        };
        httpOpts = this.addCredentials(httpOpts, data);
        return this.go(httpOpts, urlKey, options);
    }

    delete(urlKey: string, data: any, url1: string = '', options: any = {}) {
        // if (!data.uuid) {
        //     throw new Error('Delete requires uuid');
        // }
        let httpOpts = {
            method: 'DELETE',
            url: this.setUrl(urlKey, data, url1),
            body: data,
        };
        httpOpts = this.addCredentials(httpOpts, data);
        return this.go(httpOpts, urlKey, options);
    }
}
