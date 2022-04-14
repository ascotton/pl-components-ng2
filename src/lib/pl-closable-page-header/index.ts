import { NgModule } from '@angular/core';
import { PLClosablePageHeaderComponent } from './pl-closable-page-header.component';
import { PLIconModule } from '../pl-icon/index';

@NgModule({
    imports: [PLIconModule],
    exports: [PLClosablePageHeaderComponent],
    declarations: [PLClosablePageHeaderComponent],
})
export class PLClosablePageHeaderModule { }
