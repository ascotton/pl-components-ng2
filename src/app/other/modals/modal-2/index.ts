import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLModalModule } from '../../../../lib/pl-modal';
import { Modal2Component } from './modal-2.component';

@NgModule({
    imports: [CommonModule, PLModalModule],
    exports: [Modal2Component],
    declarations: [Modal2Component],
})
export class Modal2Module { }
