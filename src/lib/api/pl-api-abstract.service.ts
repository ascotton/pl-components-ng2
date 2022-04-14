import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';

@Injectable()
export class PLApiAbstractService {
    // Store info (data, loading, loaded, lastGetParams) per api (urlKey).
    private urlKeyInfo: any = {};

    constructor(private plHttp: PLHttpService, private plLodash: PLLodashService) {}

    // We only want to return ONE observable, right away on the first attempt.
    //  After that, we just need to update the existing observer.
    get(
        urlKey: string,
        params1: any = {},
        url: string = '',
        options1: any = {},
        defaultParams: any = { limit: 1000 },
        observer1: any = null,
        observable1: any = null,
        attempts: number = 0
    ) {
        const delay = 250;
        if (!this.urlKeyInfo[urlKey]) {
            this.urlKeyInfo[urlKey] = {};
        }
        const observable = new Observable((observer: any) => {
            const observerToUse = observer1 ? observer1 : observer;
            const observableToUse = observable1 ? observable1 : observable;
            if (!this.urlKeyInfo[urlKey].lastGetParams) {
                this.urlKeyInfo[urlKey].lastGetParams = defaultParams;
            }
            const params = Object.assign({}, defaultParams, params1);
            const options = Object.assign({ forceReload: false }, options1);
            let sameParams = false;
            if (!options.forceReload) {
                sameParams = this.plLodash.equals(params, this.urlKeyInfo[urlKey].lastGetParams, ['limit'], true);
                this.urlKeyInfo[urlKey].lastGetParams = params;
            }
            if (!sameParams && attempts === 0) {
                this.urlKeyInfo[urlKey].loaded = false;
                this.urlKeyInfo[urlKey].loading = false;
            }

            if (this.urlKeyInfo[urlKey].loaded || this.urlKeyInfo[urlKey].loading) {
                if (this.urlKeyInfo[urlKey].loaded) {
                    observerToUse.next(this.urlKeyInfo[urlKey].data);
                    observerToUse.complete();
                } else {
                    setTimeout(() => {
                        const delayObserverable = this.get(
                            urlKey,
                            params1,
                            url,
                            options1,
                            defaultParams,
                            observerToUse,
                            observableToUse,
                            attempts + 1
                        );
                        // subscribe to trigger it running.
                        delayObserverable.subscribe((res: any) => {});
                    }, delay);
                }
            } else {
                this.urlKeyInfo[urlKey].loading = true;
                this.plHttp.get(urlKey, params, url, options).subscribe(
                    (res: any) => {
                        this.urlKeyInfo[urlKey].loaded = true;
                        if (res.results) {
                            this.urlKeyInfo[urlKey].data = res.results ? res.results : [];
                        } else {
                            // if (params1.uuid) {
                            //     this.urlKeyInfo[urlKey].data = res;
                            // } else {
                            this.urlKeyInfo[urlKey].data = [res];
                            // }
                        }
                        observerToUse.next(this.urlKeyInfo[urlKey].data);
                        observerToUse.complete();
                    },
                    (err: any) => {
                        observerToUse.error(err);
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
}
