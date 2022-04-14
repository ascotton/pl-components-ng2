import {
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'pl-progress',
    templateUrl: './pl-progress.component.html',
    styleUrls: ['./pl-progress.component.less'],
})
export class PLProgressComponent {
    @Input() value: number = null;
    @Input() isError: false;
    @Input() isComplete: false;

    private readonly max = 1;

    classes(): any {
        return {
            error: this.isError,
            complete: this.isComplete,
        }
    }

    meterStyles(): any {
        return {
            width: this.meterWidth() + '%',
        }
    }

    isIndeterminate(): boolean {
        return this.value === null;
    }

    private meterWidth() {
        const value = this.value || 0;

        return (Math.min(this.max, Math.max(0, value)) / this.max) * 100;
    }
}
