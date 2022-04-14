import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLAnchoredDialogComponent } from './pl-anchored-dialog.component';
import { PLConfirmDialogComponent } from './pl-confirm-dialog.component';
import { PLConfirmDialogService } from './pl-confirm-dialog.service';
import { PLIconModule } from '../pl-icon/index';

import { PipeModule } from '../pipes/index';

@NgModule({
    imports: [CommonModule, PLIconModule, PipeModule],
    exports: [
        PLAnchoredDialogComponent,
        PLConfirmDialogComponent
    ],
    declarations: [
        PLAnchoredDialogComponent,
        PLConfirmDialogComponent,
    ],
})
export class PLDialogModule {}

export { PLAnchoredDialogComponent };
export { PLConfirmDialogService };
