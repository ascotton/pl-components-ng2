import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLNameService } from './pl-name.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    providers: [PLNameService],
})
export class PLNameModule {
    static forRoot(): ModuleWithProviders<PLNameModule> {
        return {
            ngModule: PLNameModule,
            providers: [PLNameService],
        };
    }
}

export { PLNameService } from './pl-name.service';
