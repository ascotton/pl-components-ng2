import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PLConfigComponent } from './pl-config.component';
import { PLButtonModule } from '../pl-button/index';
import { PLInputModule } from '../pl-input/index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PLButtonModule,
        PLInputModule,
    ],
    exports: [PLConfigComponent],
    declarations: [PLConfigComponent],
})
export class PLConfigModule { }
