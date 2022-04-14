import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLLinkComponent } from './pl-link.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [PLLinkComponent],
    declarations: [PLLinkComponent],
    providers: [],
})
export class PLLinkModule {
    static forRoot(): ModuleWithProviders<PLLinkModule> {
        return {
            ngModule: PLLinkModule,
        };
    }
}

export { PLLinkService } from './pl-link.service';
