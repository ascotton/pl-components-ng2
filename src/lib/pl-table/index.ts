import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PLLodashService } from '../pl-lodash';

import { PLTableService } from './pl-table.service';
import { PLTableComponent } from './pl-table.component';
import { PLButtonModule } from '../pl-button/index';
import { PLDotLoaderModule } from '../pl-dot-loader/index';
import { PLIconModule } from '../pl-icon/index';
import { PLInputModule } from '../pl-input/index';
import { PipeModule } from '../pipes/index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
        PipeModule,
    ],
    exports: [PLTableComponent],
    declarations: [PLTableComponent],
    providers: [PLLodashService, PLTableService],
})
export class PLTableModule {
    static forRoot(): ModuleWithProviders<PLTableComponent> {
        return {
            ngModule: PLTableComponent,
            providers: [PLTableService],
        };
    }
}
