import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { PLTableFrameworkService } from './pl-table-framework.service';

@Component({
    selector: 'pl-table-row',
    templateUrl: './pl-table-row.component.html',
    styleUrls: ['./pl-table-row.component.less'],
    animations: [
        /*
            The expansion animation cannot know the target height of the expanded row. As
            a workaround, during expansion we animate on max-height and target a value large
            enough to fill the viewport. After the animation is complete, we set the
            max-height to auto in case the expanded row needs to be taller than the viewport.

            On collapse, we can simply animate from the current height down to 0.
        */
        trigger('expansionAnimation', [
            state('collapsed', style({ height: 0, maxHeight: 0, opacity: 0 })),
            state('expanded', style({ height: 'auto', maxHeight: 'auto', opacity: 1 })),
            transition('collapsed => expanded', [
                // During this transition, max-height will limit the height of the row
                style({ height: 'auto' }),
                // https://easings.net/en#easeInExpo
                animate('200ms cubic-bezier(0.7, 0, 0.84, 0)', style({ maxHeight: '100vh' })),
            ]),
            transition('expanded => collapsed', [
                // Prior to animating, set max-height to non-auto value. Cannot animate from
                // auto to 0. Since max-height set to 0 in collapsed state, it needs an actual
                // length value here.
                style({ height: '*', maxHeight: '100vh' }),
                // https://easings.net/en#easeOutExpo
                animate('200ms cubic-bezier(0.16, 1, 0.3, 1)'),
            ]),
        ]),
    ],
})
export class PLTableRowComponent {
    /*
        isExpanded. Set to true to expand the row and show a full-width cell.

        Use the [expandable] attribute to mark the cell that will be full-width:

        <pl-table-row [isExpanded]="true">
            <pl-table-cell>column 1</pl-table-cell>
            <pl-table-cell>column 2</pl-table-cell>
            <pl-table-cell>column 3</pl-table-cell>
            <pl-table-cell expandable>
                Expanded table row content, full-width of the table
            </pl-table-cell>
        </pl-table-row>
    */
    @Input() isExpanded = false;

    /**
     * collapsed - event fired when animation to collapse the expanded row
     * completes. This allows the consumer to remove the row from the DOM, if
     * desired.
     */
    @Output() readonly collapsed = new EventEmitter<boolean>();

    expansionAnimationState(): string {
        return this.isExpanded ? 'expanded' : 'collapsed';
    }

    expansionAnimationDone({ toState }: { toState: string }): void {
        if (toState === 'collapsed') {
            this.collapsed.emit(true);
        }
    }
}
