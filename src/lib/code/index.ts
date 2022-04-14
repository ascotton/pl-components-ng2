import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeDirective } from './code.component';

@NgModule({
    imports: [CommonModule],
    exports: [CodeDirective],
    declarations: [CodeDirective],
})
export class CodeModule { }
