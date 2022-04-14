import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLBrowserUnsupportedComponent } from './pl-browser-unsupported.component';

@NgModule({
    imports: [CommonModule],
    exports: [PLBrowserUnsupportedComponent],
    declarations: [PLBrowserUnsupportedComponent],
})
export class PLBrowserModule { }

export { PLBrowserService } from './pl-browser.service';
