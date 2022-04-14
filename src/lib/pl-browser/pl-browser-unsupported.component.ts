import { Component } from '@angular/core';

@Component({
    selector: 'pl-browser-unsupported',
    templateUrl: './pl-browser-unsupported.component.html',
    styleUrls: ['./pl-browser-unsupported.component.less'],
})
export class PLBrowserUnsupportedComponent {
    supportedBrowsers: any[] = [
        {
            name: 'Google Chrome',
            href: 'https://www.google.com/chrome',
            img: 'https://cdnjs.cloudflare.com/ajax/libs/jReject/1.1.4/images/browser_chrome.gif',
        },
        {
            name: 'Mozilla Firefox',
            href: 'http://www.mozilla.org/en-US/firefox/new/',
            img: 'https://cdnjs.cloudflare.com/ajax/libs/jReject/1.1.4/images/browser_firefox.gif',
        },
    ];

    constructor() {}
}
