import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLE2EOutputComponent } from './pl-e2e-output.component';
import { PLE2EOutputService } from './pl-e2e-output.service';

@NgModule({
    imports: [CommonModule],
    exports: [PLE2EOutputComponent],
    declarations: [PLE2EOutputComponent],
    providers: [PLE2EOutputService],
})
export class PLE2ETestModule { }

export { PLE2EOutputService } from './pl-e2e-output.service';
