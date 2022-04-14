import { Component, Input } from '@angular/core';

@Component({
    selector: 'pl-dot-loader',
    templateUrl: './pl-dot-loader.component.html',
    styleUrls: ['./pl-dot-loader.component.less'],
})
export class PLDotLoaderComponent {
    @Input('align') align: string = 'center';
    @Input('overlay') overlay: boolean;

    constructor() {}
}
