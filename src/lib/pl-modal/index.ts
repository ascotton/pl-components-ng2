import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLModalComponent } from './pl-modal.component';
import { PLModalHeaderWrapperComponent } from './pl-modal-header-wrapper.component';
import { PLModalService } from './pl-modal.service';
import { PLIconModule } from '../pl-icon/index';

@NgModule({
    imports: [CommonModule, PLIconModule],
    exports: [PLModalComponent, PLModalHeaderWrapperComponent],
    declarations: [PLModalComponent, PLModalHeaderWrapperComponent],
    providers: [
        PLModalService,
    ],
})
export class PLModalModule { }

export { PLModalService } from './pl-modal.service';
