import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

let plLinkService: any;

@Injectable({ providedIn: 'root' })
export class PLLinkService {
    historyState: any[] = null;
    backStateObserver: any = null;
    backStateObserverbale: any = null;
    private backLink: string = '';

    constructor(private router: Router, private store: Store<any>) {
        plLinkService = this;
        this.setupHistoryState();
        store.select('backLink').subscribe((previousState: any) => {
            if (previousState) {
                this.backLink = previousState.title;
            }
        });
    }

    historyReplace(url: string) {
        history.replaceState({}, null, url);
    }

    formQueryParamsString(queryParams: any = {}) {
        let urlQuery: any[] = [];
        for (let key in queryParams) {
            urlQuery.push(`${key}=${queryParams[key]}`);
        }
        let urlQueryString = urlQuery.length ? `?${urlQuery.join('&')}` : '';
        return urlQueryString;
    }

    formUrl(href: string, queryParams: any = {}) {
        const queryString = this.formQueryParamsString(queryParams);
        return `${href}${queryString}`;
    }

    setupHistoryState() {
        if (!this.historyState) {
            this.historyState = [];
            // return new Observable((observer: any) => {
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const title = this.getDeepestTitle(this.router.routerState.snapshot.root);
                    if (title !== 'SKIPHISTORY') {
                        plLinkService.historyState.push({ title: title });
                        plLinkService.backStateChange();
                    }
                }
            });

            window.addEventListener(
                'popstate',
                function(e) {
                    plLinkService.popState();
                    // Remove two since the current one will be re-added again.
                    plLinkService.popState();
                },
                true
            );
            // });
        }
    }

    popState() {
        plLinkService.historyState.pop();
        plLinkService.backStateChange();
    }

    backStateChange() {
        const previousState = this.getPreviousState();
        if (this.backStateObserver) {
            this.backStateObserver.next(previousState);
        }
        this.store.dispatch({
            type: 'UPDATE_BACK_LINK',
            payload: previousState,
        });
    }

    updateState(title: string = '') {
        const length = this.historyState ? this.historyState.length : -1;
        if (length) {
            this.historyState[length - 1] = Object.assign({}, this.historyState[length - 1], {
                title: title,
            });
        }
        plLinkService.backStateChange();
    }

    addStateIfUnique(title: string = '') {
        const currentTitle = this.getCurrentState().title;
        if (currentTitle !== title) {
            plLinkService.historyState.push({ title: title });
            plLinkService.backStateChange();
        }
    }

    getPreviousState() {
        const length = this.historyState ? this.historyState.length : -1;
        return length && length > 1 ? this.historyState[length - 2] : {};
    }

    getCurrentState() {
        const length = this.historyState ? this.historyState.length : -1;
        return length && length > 0 ? this.historyState[length - 1] : {};
    }

    getBackState() {
        if (!this.backStateObserverbale) {
            this.backStateObserverbale = new Observable((observer: any) => {
                this.backStateObserver = observer;
            });
        }
        return this.backStateObserverbale;
    }

    goBack(defaultRouterPath: any = null, defaultRouterParams = {}) {
        console.log('goBack', defaultRouterPath, defaultRouterParams, this.backLink);
        if (this.backLink) {
            history.back();
        } else if (defaultRouterPath) {
            this.router.navigate(defaultRouterPath, defaultRouterParams);
        }
    }

    goToUrl(url: string) {
        // this.plLink.historyReplace(url);
        if (!this.isActiveUrl(url)) {
            this.popState();
            this.router.navigateByUrl(url, { replaceUrl: true });
        }
    }

    isActiveUrl(url: string) {
        return url === this.router.url;
    }

    isActive(href: string, queryParams: any) {
        return this.isActiveUrl(this.formUrl(href, queryParams));
    }

    navigate(href: string, queryParams: any) {
        const url = this.formUrl(href, queryParams);
        this.goToUrl(url);
    }

    // http://stackoverflow.com/a/40468212
    private getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title = routeSnapshot.data && routeSnapshot.data['title'] ? routeSnapshot.data['title'] : '';
        if (routeSnapshot.firstChild) {
            title = this.getDeepestTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }
}
