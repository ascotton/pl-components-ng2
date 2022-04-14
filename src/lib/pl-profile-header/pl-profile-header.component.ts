import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PLLinkService } from '../pl-link/pl-link.service';

@Component({
    selector: 'pl-profile-header',
    templateUrl: './pl-profile-header.component.html',
    styleUrls: ['./pl-profile-header.component.less'],
})
export class PLProfileHeaderComponent {
    @Input('showCloseBtn') showCloseBtn: boolean = true;

    constructor(private plLink: PLLinkService) {}

    onClose() {
        this.plLink.goBack();
    }
}

@Component({
    selector: 'pl-profile-header-body',
    template: '<ng-content></ng-content>',
    styleUrls: ['./pl-profile-header-body.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileHeaderBodyComponent {
    constructor() {}
}

@Component({
    selector: 'pl-profile-header-cameo',
    template: '<ng-content></ng-content>',
    styleUrls: ['./pl-profile-header-cameo.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileHeaderCameoComponent {
    constructor() {}
}

@Component({
    selector: 'pl-profile-header-tabs',
    template: '<ng-content></ng-content>',
    styleUrls: ['./pl-profile-header-tabs.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileHeaderTabsComponent {
    constructor() {}
}

@Component({
    selector: 'pl-profile-header-tab',
    template: '<ng-content></ng-content>',
    styleUrls: ['./pl-profile-header-tab.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileHeaderTabComponent {
    constructor() {}
}

@Component({
    selector: 'pl-profile-header-title',
    template: '<h1><ng-content></ng-content></h1>',
    styleUrls: ['./pl-profile-header-title.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLProfileHeaderTitleComponent {
    constructor() {}
}
