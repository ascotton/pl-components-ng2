import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'pl-anchored-dialog',
    templateUrl: './pl-anchored-dialog.component.html',
    styleUrls: ['./pl-anchored-dialog.component.less'],
})
export class PLAnchoredDialogComponent {
    @Input() title = '';
    @Output() closeAttempt: EventEmitter<any> = new EventEmitter();

    private _isExpanded = true;

    expandCollapseIcon(): string {
        return this.isExpanded() ? 'chevron-down' : 'chevron-up';
    }

    onCloseClick(): void {
        this.closeAttempt.emit();
    }

    onExpandCollapseClick(): void {
        this._isExpanded = !this._isExpanded;
    }

    isExpanded(): boolean {
        return this._isExpanded;
    }
}
