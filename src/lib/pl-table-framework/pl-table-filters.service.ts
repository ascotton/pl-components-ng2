import { Injectable } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFilter } from './pl-table-filter';

@Injectable()
export class PLTableFiltersService {

    multipleValuesDelimiter = ',';

    constructor(private plTableFramework: PLTableFrameworkService) {}

    clearFiltersButtonLabel(filterCount: number): string {
        return filterCount === 1 ? 'Clear Filter' : 'Clear All Filters';
    }

    formOneTextFromTextArray(filter: PLTableFilter) {
        if (filter.textArray) {
            filter.text = filter.textArray.join(this.multipleValuesDelimiter);
        }
        return filter;
    }

    formTextFromTextArray(filters: PLTableFilter[]) {
        filters.forEach((filter: PLTableFilter) => {
            if (filter.textArray) {
                filter.text = filter.textArray.join(this.multipleValuesDelimiter);
            }
        });
        return filters;
    }

    /*
        Derive filter type from properties.
    */
    inferredFilterType(filter: PLTableFilter): string {
        if (filter.type) {
            return filter.type;
        }

        if ('selectOpts' in filter) {
            return 'select';
        }

        if ('selectOptsBigFilter' in filter) {
            return 'selectBigFilter';
        }

        if ('selectOptsMulti' in filter) {
            return 'multiSelect';
        }

        if ('selectOptsCheckbox' in filter) {
            return 'checkbox';
        }

        if ('selectOptsApi' in filter) {
            return 'selectApi';
        }

        if ('selectOptsMultiApi' in filter) {
            return 'multiSelectApi';
        }

        if ('datepicker' in filter) {
            return 'datepicker'
        }
        
        return 'text';
    }

    updateOneFilter(filter1: any) {
        const filter = this.formOneTextFromTextArray(filter1);
        this.plTableFramework.updateOneFilter(filter);
        return filter;
    }

    updateOneFilterWithQuery(filter1: any) {
        const filter = this.updateOneFilter(filter1);
        const queryInfo = { data: {}, query: this.plTableFramework.formQuery() };
        return {
            filter,
            queryInfo,
        };
    }

    updateSomeFilters(filters1: PLTableFilter[]) {
        const filters = this.formTextFromTextArray(filters1);
        this.plTableFramework.updateSomeFilters(filters);
        return filters;
    }

    updateSomeFiltersWithQuery(filters1: PLTableFilter[]) {
        const filters = this.updateSomeFilters(filters1);
        const queryInfo = { data: {}, query: this.plTableFramework.formQuery() };
        return {
            filters,
            queryInfo,
        };
    }
}
