import { Component, Input } from '@angular/core';

@Component({
    selector: 'pl-closable-page-header',
    templateUrl: './pl-closable-page-header.component.html',
    styleUrls: ['./pl-closable-page-header.component.less'],
})
export class PLClosablePageHeaderComponent {
    @Input('headerText') headerText = '';
    @Input('closeCallback') closeCallback: any;

    constructor() {}

    close() {
        if (this.closeCallback) {
            this.closeCallback.call();
        }
    }
}
