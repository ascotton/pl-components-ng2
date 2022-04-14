import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLAppNavComponent } from './pl-app-nav.component';
import { PLIconModule } from '../pl-icon/index';

@NgModule({
    imports: [CommonModule, RouterModule, PLIconModule],
    exports: [PLAppNavComponent],
    declarations: [PLAppNavComponent],
})
export class PLAppNavModule { }
