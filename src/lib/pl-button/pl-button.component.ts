import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'button[pl-button]',
    templateUrl: './pl-button.component.html',
    styleUrls: ['./pl-button.component.less'],
    host: {},
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PLButtonComponent {
    @Input() tooltip = '';

    _color: string;

    /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
    _isKeyboardFocused: boolean = false;

    /** Whether a mousedown has occurred on this element in the last 100ms. */
    _isMouseDown: boolean = false;

    constructor() {}

    @Input()
    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }
}
