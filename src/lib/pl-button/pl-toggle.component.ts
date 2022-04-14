import {
    Component,
    ViewEncapsulation,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

@Component({
    selector: 'plToggle',
    templateUrl: './pl-button.component.html',
    styleUrls: ['./pl-button.component.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLToggleComponent {
    @Input() tooltip = '';

    constructor() {}
}
