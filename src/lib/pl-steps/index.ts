import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PLStepsService } from './pl-steps.service';
import { PLStepsComponent } from './pl-steps.component';
import { PLStepsButtonsComponent } from './pl-steps-buttons.component';
import { PLButtonModule } from '../pl-button/index';
import { PLIconModule } from '../pl-icon/index';
import { PLLinkModule } from '../pl-link/index';

@NgModule({
    imports: [CommonModule, RouterModule, PLButtonModule, PLIconModule, PLLinkModule],
    exports: [PLStepsComponent, PLStepsButtonsComponent],
    declarations: [PLStepsComponent, PLStepsButtonsComponent],
    providers: [PLStepsService],
})
export class PLStepsModule {
    static forRoot(): ModuleWithProviders<PLStepsModule> {
        return {
            ngModule: PLStepsModule,
            providers: [PLStepsService],
        };
    }
}
