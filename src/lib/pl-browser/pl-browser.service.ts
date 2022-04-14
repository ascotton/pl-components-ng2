import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { PLLinkService } from '../pl-link/pl-link.service';
import { environment } from '../../environments/environment';

var InstallTrigger: any = InstallTrigger;
var opr: any = opr;
const useDevBrowserCheck = localStorage.getItem('BROWSER_CHECK_DEV');

@Injectable({ 
    providedIn: 'root' 
})
export class PLBrowserService {
    titleSuffix: string = ' - PL Components';
    appName: string = environment.app_name;
    gitSha: string = environment.git_sha;
    apps: any = environment.apps;
    intervalVersion: any = null;

    constructor(
        private titleService: Title,
        private location: Location,
        private plLink: PLLinkService
    ) {}

    setTitleSuffix(suffix: string) {
        this.titleSuffix = suffix;
    }

    setTitle(titlePart: string = '', params: any = {}) {
        if (params.updateLinkState) {
            this.plLink.updateState(titlePart);
        } else if (params.addLinkStateIfUnique) {
            this.plLink.addStateIfUnique(titlePart);
        }
        let title = '';
        if (titlePart && titlePart.length && titlePart !== 'SKIPHISTORY') {
            title = `${titlePart} - ${this.titleSuffix}`;
        } else {
            title = this.titleSuffix;
        }
        this.titleService.setTitle(title);
    }

    getSubRoute() {
        const locationPath = this.location.path();
        let subRoute = locationPath.slice(locationPath.lastIndexOf('/') + 1, locationPath.length);
        const posQuestionMark = subRoute.indexOf('?');
        if (posQuestionMark > -1) {
            subRoute = subRoute.slice(0, posQuestionMark);
        }
        return subRoute;
    }

    detectBrowser(vars: { window: any, document: any, opr: any, navigator: any }): any {
        const ua = vars.navigator.userAgent || '';
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isOpera = (!!vars.window.opr && !!vars.opr.addons) || !!vars.window.opera || ua.indexOf(' OPR/') >= 0;
        const isIe = /*@cc_on!@*/ false || !!vars.document.documentMode;
        const isSafari = /Apple/.test(navigator.vendor);

        return {
            // http://stackoverflow.com/a/9851769/1429106
            // Opera 8.0+
            opera: isOpera,
            // Firefox 1.0+
            firefox: ua.toLowerCase().includes('firefox'),
            // At least Safari 3+: "[object HTMLElementConstructor]"
            safari: isSafari,
            // Internet Explorer 6-11
            ie: isIe,
            // Edge 20+
            edge: !isIe && !!vars.window.StyleMedia,
            // Chrome 1+
            chrome: isChrome,
            // Blink engine detection
            blink: (isChrome || isOpera) && !!vars.window.CSS,
            // Cypress headless (chromium)
            cy_headless: ua.includes('Cypress'),
            // Chrome iPad
            chrome_ipad: ua.toLowerCase().includes('crios') && ua.toLowerCase().includes('ipad'),
        }
    }

    isSupported(browsers = ['chrome', 'firefox', 'cy_headless', 'chrome_ipad']) {
        const browser = this.detectBrowser({ window, document, opr, navigator });
        for (let ss = 0; ss < browsers.length; ss++) {
            if (browser[browsers[ss]]) {
                return true;
            }
        }
        if (useDevBrowserCheck && browser['safari']) {
            return true;
        }
        return false;
    }
}
