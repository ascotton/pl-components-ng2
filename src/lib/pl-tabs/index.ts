import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PLTabsComponent } from './pl-tabs.component';
import { PLLinkModule } from '../pl-link/index';

@NgModule({
    imports: [CommonModule, RouterModule, PLLinkModule],
    exports: [PLTabsComponent],
    declarations: [PLTabsComponent],
})
export class PLTabsModule { }
