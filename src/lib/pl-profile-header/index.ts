import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    PLProfileHeaderComponent,
    PLProfileHeaderBodyComponent,
    PLProfileHeaderCameoComponent,
    PLProfileHeaderTitleComponent,
    PLProfileHeaderTabsComponent,
    PLProfileHeaderTabComponent,
} from './pl-profile-header.component';
import { PLIconModule } from '../pl-icon/index';
import { PLLinkModule } from '../pl-link/index';

@NgModule({
    imports: [CommonModule, PLIconModule, PLLinkModule],
    exports: [
        PLProfileHeaderComponent,
        PLProfileHeaderCameoComponent,
        PLProfileHeaderTitleComponent,
        PLProfileHeaderBodyComponent,
        PLProfileHeaderTabsComponent,
        PLProfileHeaderTabComponent,
    ],
    declarations: [
        PLProfileHeaderComponent,
        PLProfileHeaderCameoComponent,
        PLProfileHeaderTitleComponent,
        PLProfileHeaderBodyComponent,
        PLProfileHeaderTabsComponent,
        PLProfileHeaderTabComponent,
    ],
})
export class PLProfileHeaderModule { }
