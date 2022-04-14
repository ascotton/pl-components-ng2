import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'pl-button-group',
    templateUrl: './pl-button-group.component.html',
    styleUrls: ['./pl-button-group.component.less'],
    host: {},
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLButtonGroupComponent {
    constructor() {}
}
