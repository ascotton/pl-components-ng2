import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PLLodashService } from '../pl-lodash';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFrameworkUrlService } from './pl-table-framework-url.service';
import { PLTableFiltersService } from './pl-table-filters.service';

import { PLTableLocalDataService } from './pl-table-local-data.service';
import { PLTableCellComponent } from './pl-table-cell.component';
import { PLTableFilterComponent } from './pl-table-filter.component';
import { PLTableFilterSetComponent } from './pl-table-filter-set.component';
import { PLTableFiltersSideComponent } from './pl-table-filters-side.component';
import { PLTableFiltersTopComponent } from './pl-table-filters-top.component';
import { PLTableFiltersTopGroupsComponent } from './pl-table-filters-top-groups.component';
import { PLTableFooterComponent } from './pl-table-footer.component';
import { PLTableHeaderComponent } from './pl-table-header.component';
import { PLTableHeaderCellComponent } from './pl-table-header-cell.component';
import { PLTableOrderTopComponent } from './pl-table-order-top.component';
import { PLTableRowComponent } from './pl-table-row.component';
import { PLTableWrapperComponent } from './pl-table-wrapper.component';

import { PLButtonModule } from '../pl-button/index';
import { PLDotLoaderModule } from '../pl-dot-loader/index';
import { PLIconModule } from '../pl-icon/index';
import { PLInputModule } from '../pl-input/index';
import { PipeModule } from '../pipes/index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
        PipeModule,
    ],
    exports: [
        PLTableCellComponent,
        PLTableFooterComponent,
        PLTableFilterComponent,
        PLTableFilterSetComponent,
        PLTableFiltersSideComponent,
        PLTableFiltersTopComponent,
        PLTableFiltersTopGroupsComponent,
        PLTableHeaderComponent,
        PLTableHeaderCellComponent,
        PLTableOrderTopComponent,
        PLTableRowComponent,
        PLTableWrapperComponent,
    ],
    declarations: [
        PLTableCellComponent,
        PLTableFooterComponent,
        PLTableFilterComponent,
        PLTableFilterSetComponent,
        PLTableFiltersSideComponent,
        PLTableFiltersTopComponent,
        PLTableFiltersTopGroupsComponent,
        PLTableHeaderComponent,
        PLTableHeaderCellComponent,
        PLTableOrderTopComponent,
        PLTableRowComponent,
        PLTableWrapperComponent,
    ],
    providers: [PLLodashService, PLTableFrameworkService, PLTableFrameworkUrlService,
     PLTableFiltersService],
})
export class PLTableFrameworkModule {
    static forRoot(): ModuleWithProviders<PLTableFrameworkModule> {
        return {
            ngModule: PLTableFrameworkModule,
            providers: [PLTableFrameworkService, PLTableFrameworkUrlService,
             PLTableFiltersService],
        };
    }
}

export { PLTableFrameworkService } from './pl-table-framework.service';
export { PLTableFrameworkUrlService } from './pl-table-framework-url.service';
export { PLTableFilter } from './pl-table-filter';
export { PLTableFiltersService } from './pl-table-filters.service';
export { PLTableLocalDataService } from './pl-table-local-data.service';
