
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { PLBrowserService } from '../pl-browser/pl-browser.service';

@Component({
    selector: 'pl-tabs',
    templateUrl: './pl-tabs.component.html',
    styleUrls: ['./pl-tabs.component.less'],
})
export class PLTabsComponent implements OnInit, OnChanges {
    @Input() tabs: any[] = [];
    @Input() updatePageTabTitleBasedOnActiveLink = false;

    constructor(private router: Router, private plBrowserSvc: PLBrowserService) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) this.updateClass();
        });
    }

    ngOnInit() {
        this.updateClass();
    }

    ngOnChanges() {
        this.updateClass();
    }

    plLinkEvent(event: string) {
        if (event) this.updatePageTabTitle(event);
    }

    updateClass() {
        this.tabs.forEach((tab: any) => {
            if (!tab.classes) tab.classes = {};

            if (!tab.classesLink) {
                tab.classesLink = {
                    'padding-tb': true,
                    'link-unstyled': true,
                    'link-no-color': true,
                };
            }
        });
    }

    /**
     * Function for updating the title of the page tab.
     * Based on the label received, a filter is performed within the tabs displayed in `pl-tabs`.
     * The tab that matches the `label` is the active/current tab where the user is.
     * The page tab will be updated with the active/current `tab.pageTabTitle` as long as there is a pageTabTitle.
     *
     * @param label The text of the link that is active within the pl-tabs.
     */
    private updatePageTabTitle(label: string) {
        const selectedTab = this.tabs.filter((tab: any) => tab.label === label && tab.pageTabTitle);
        if (selectedTab.length === 1) setTimeout(() => this.plBrowserSvc.setTitle(selectedTab[0].pageTabTitle), 0);
    }
}
