import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLToastComponent } from './pl-toast.component';
import { PLIconModule } from '../pl-icon/index';

@NgModule({
    imports: [CommonModule, PLIconModule],
    exports: [PLToastComponent],
    declarations: [PLToastComponent],
})
export class PLToastModule { }

export { PLToastService } from './pl-toast.service';
