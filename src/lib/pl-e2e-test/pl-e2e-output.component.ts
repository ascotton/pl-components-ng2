import { Component } from '@angular/core';

import { PLE2EOutputService } from './pl-e2e-output.service';

@Component({
    selector: 'pl-e2e-output',
    templateUrl: './pl-e2e-output.component.html',
    styleUrls: ['./pl-e2e-output.component.less'],
    inputs: [],
})
export class PLE2EOutputComponent {
    output: string = '[empty]';

    constructor(private plE2EOutput: PLE2EOutputService) {}

    ngOnInit() {
        this.plE2EOutput.loadObserver().subscribe((res: any) => {
            this.setOutput(res.output);
        });
    }

    setOutput(output: string) {
        this.output = output;
    }
}
