import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLModalModule } from '../../../../lib/pl-modal';
import { PLIconModule } from '../../../../lib/pl-icon';
import { PLInputModule } from '../../../../lib/pl-input';
import { Modal1Component } from './modal-1.component';

@NgModule({
    imports: [CommonModule, PLModalModule, PLIconModule, PLInputModule],
    exports: [Modal1Component],
    declarations: [Modal1Component],
})
export class Modal1Module { }
