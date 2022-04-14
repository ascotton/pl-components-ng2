import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable()
export class PLTableService {
    queryNamespaces: any = {
        filter: 'f',
        pageSize: 'l', // limit
        pageNumber: 'p',
        order: 'o',
    };
    queryPrefixDelimiter: string = '_';
    // ONE instance, per state name.
    subscribers: any = {};
    // One per state name.
    routeParams: any = {};

    constructor(private route: ActivatedRoute, private router: Router, private location: Location) {}

    getRouteParams(stateName: string) {
        return new Observable((observer: any) => {
            if (this.routeParams[stateName]) {
                observer.next(this.routeParams[stateName]);
            } else {
                this.subscribers[stateName] = this.route.queryParams.subscribe((routeParams: any) => {
                    this.routeParams[stateName] = routeParams;
                    observer.next(this.routeParams[stateName]);
                });
            }
        });
    }

    destroySubscriber(stateName: string) {
        if (this.subscribers[stateName]) {
            this.subscribers[stateName].unsubscribe();
        }
    }

    getStateFromUrl(stateName: string) {
        return new Observable((observer: any) => {
            this.getRouteParams(stateName)
                .subscribe((routeParams: any) => {
                    const query = this.getQueryParamsFromUrl(stateName, routeParams);
                    observer.next({ query: query });
                })
                .unsubscribe();
        });
    }

    updateUrl(stateName: string, queryObj: any[]) {
        this.getRouteParams(stateName)
            .subscribe((routeParams: any) => {
                const newUrlParams = this.addNamePrefix(stateName, queryObj);
                const urlParams = Object.assign({}, this.clearStateParams(stateName, routeParams), newUrlParams);

                const currentUrl = this.router.url;
                const posQuestionMark = currentUrl.indexOf('?');
                let urlPath = currentUrl;
                if (posQuestionMark > -1) {
                    urlPath = currentUrl.slice(0, posQuestionMark);
                }
                let urlQuery: any[] = [];
                for (let key in urlParams) {
                    urlQuery.push(`${key}=${urlParams[key]}`);
                }
                let urlQueryString = urlQuery.length ? `?${urlQuery.join('&')}` : '';
                // Need the base href in the front so use prepare external url for that.
                let fullUrl = this.location.prepareExternalUrl(`${urlPath}${urlQueryString}`);
                history.replaceState({}, null, fullUrl);
                this.getStateFromUrl(stateName);

                // http://stackoverflow.com/questions/39400997/angular-2-new-router-change-set-query-params
                // this.router.navigate([], { queryParams: urlParams });
            })
            .unsubscribe();
    }

    private clearStateParams(stateName: string, routeParams: any) {
        const clearedParams: any = Object.assign({}, routeParams);
        for (let qq in routeParams) {
            if (qq.indexOf(stateName) === 0) {
                delete clearedParams[qq];
            }
        }
        return clearedParams;
    }

    private addNamePrefix(stateName: string, queryObj: any[]) {
        const urlParams = {};
        let key: string;
        let namespacePrefix: string;
        queryObj.forEach((query: any) => {
            if (query.value) {
                namespacePrefix = this.queryNamespaces[query.type];
                key = `${stateName}${namespacePrefix}${this.queryPrefixDelimiter}${query.key}`;
                urlParams[key] = query.value;
            }
        });
        return urlParams;
    }

    private getKeyWithoutPrefix(fullKey: string, stateName: string) {
        let prefix: string;
        let queryPart: string = '';
        for (let xx in this.queryNamespaces) {
            prefix = `${stateName}${this.queryNamespaces[xx]}${this.queryPrefixDelimiter}`;
            if (fullKey.indexOf(prefix) === 0) {
                queryPart = fullKey.slice(prefix.length, fullKey.length);
                return queryPart;
            }
        }
        return '';
    }

    private getQueryParamsFromUrl(stateName: string, routeParams: any) {
        const query = {};
        let queryPart: string;
        let val: any;
        for (let qq in routeParams) {
            queryPart = this.getKeyWithoutPrefix(qq, stateName);
            if (queryPart && queryPart.length) {
                val = routeParams[qq];
                query[queryPart] = val;
            }
        }
        return query;
    }
}
