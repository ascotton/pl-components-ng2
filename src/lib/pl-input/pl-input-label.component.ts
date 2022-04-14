import { Component } from '@angular/core';

@Component({
    selector: 'pl-input-label',
    templateUrl: './pl-input-label.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-label.component.less'],
    inputs: ['label', 'required'],
})
export class PLInputLabelComponent {
    label: string = '';

    constructor() {}
}
