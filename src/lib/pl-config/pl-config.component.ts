import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PLUrlsService } from '../pl-http/pl-urls.service';
import { PLToastService } from '../pl-toast';

@Component({
    selector: 'pl-config',
    templateUrl: './pl-config.component.html',
    styleUrls: ['./pl-config.component.less'],
    inputs: [],
})
export class PLConfigComponent {
    configForm: FormGroup = new FormGroup({});
    appUrls: any[] = [];

    constructor(private plUrls: PLUrlsService, private plToast: PLToastService) {}

    ngOnInit() {
        this.refresh();
        // this.formUrlInputs();
    }

    formUrlInputs() {
        const urls: any[] = [];
        for (let key in this.plUrls.urls) {
            urls.push({
                label: key,
                value: this.plUrls.urls[key],
            });
        }
        this.appUrls = urls;
    }

    submit() {
        const urls: any = {};
        this.appUrls.forEach((appUrl: any) => {
            urls[appUrl.label] = appUrl.value;
        });
        this.plUrls.setUrls(urls);
        this.plToast.show('success', 'Urls updated and saved in local storage');
    }

    clearLocalStorage() {
        this.plUrls.clearFromLocalStorage();
        this.plToast.show('success', 'Urls cleared from local storage');
        this.refresh();
    }

    refresh() {
        this.plUrls.formUrls();
        this.formUrlInputs();
    }
}
