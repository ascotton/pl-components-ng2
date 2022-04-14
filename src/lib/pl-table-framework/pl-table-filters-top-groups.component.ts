import { Component, Output, EventEmitter } from '@angular/core';

import { PLLodashService } from '../pl-lodash';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';
import { PLTableFilter } from './pl-table-filter';

@Component({
    selector: 'pl-table-filters-top-groups',
    templateUrl: './pl-table-filters-top-groups.component.html',
    styleUrls: ['./pl-table-filters-top-groups.component.less'],
    inputs: ['filtersPrimary', 'filtersSecondary', 'multipleValuesDelimiter', 'canCloseFilters'],
})
export class PLTableFiltersTopGroupsComponent {
    @Output() onQuery = new EventEmitter<any>();
    @Output() onSearch = new EventEmitter<any>();
    @Output() onSetModelOptions = new EventEmitter<{ filterValue: string, modelValues: string[]}>();

    filtersPrimary: PLTableFilter[] = [];
    filtersSecondary: PLTableFilter[] = [];
    multipleValuesDelimiter: string = ',';
    canCloseFilters: boolean = true;

    secondaryVisible: boolean = false;
    classes: any = {
        secondaryVisible: false,
    };


    private filterTimeout: number = 1000;
    private filterTimeoutTrigger: any = -1;

    private initedFilterValues: any[] = [];
    private inited: boolean = false;

    constructor(
        private plTableFramework: PLTableFrameworkService,
        private plTableFilterService: PLTableFiltersService,
        private plLodash: PLLodashService
    ) {
        plTableFramework.filtersUpdated$.subscribe((filterValues: any) => {
            this.initedFilterValues = filterValues;
            this.setFiltersFromUpdate(filterValues);
            this.init(false);
        });
    }

    ngOnInit() {
        this.inited = true;
        this.init(false);
    }

    ngOnChanges() {
        this.init(true);
    }

    ngOnDestroy() {
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
    }

    setFiltersFromUpdate(filterValues: any[] = []) {
        const filters = this.filters();

        const filterValueMaps = this.plTableFramework.mappedFilterValues(filters, filterValues);

        // modifies this.filtersPrimary and this.filtersSecondary!
        this.plTableFramework.updateFiltersFromValues(filterValueMaps);

        // Always fire update event to catch when last selected item is unselected
        const multiSelectFilters = filters.filter(f => f.type === 'multiSelectApi');
        multiSelectFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.textArray || [] });
        });

        const selectApiFilters = filters.filter(f => f.type === 'selectApi');
        selectApiFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.text ? [f.text] : [] });
        });
    }

    changeFilter(evt?: any) {
        this.onFilter(evt);
    }

    clearPrimaryFilters(evt: any) {
        this.filtersPrimary.forEach((filter: any) => {
            if (filter.text !== undefined) {
                filter.text = '';
            }
            if (filter.textArray !== undefined) {
                filter.textArray = [];
            }
        });
    }

    clearSecondaryFilters(evt: any) {
        this.filtersSecondary.forEach((filter: any) => {
            if (filter.text !== undefined) {
                filter.text = '';
            }
            if (filter.textArray !== undefined) {
                filter.textArray = [];
            }
        });
        this.changeFilter({});
    }

    private init(onchanges: boolean) {
        if (this.inited && this.initedFilterValues.length) {
            this.setFiltersFromUpdate(this.initedFilterValues);
            // Reset.
            this.initedFilterValues = [];
        }

        // Add type to each filter, if not already defined
        this.filters().forEach((filter) => {
            filter.type = this.plTableFilterService.inferredFilterType(filter);
        });
    }

    filterKeyup(evt: any) {
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
        const keyCodeEnter = 13;
        if (evt.evt && evt.evt.keyCode === keyCodeEnter) {
            this.onFilter({});
        } else {
            this.filterTimeoutTrigger = setTimeout(() => {
                this.onFilter({});
            }, this.filterTimeout);
        }
    }

    private filters(): PLTableFilter[] {
        return [...this.filtersPrimary, ...this.filtersSecondary];
    }

    onFilter(evt?: any) {
        this.query();
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
    }

    search(filterValue: string, event?: any) {
        this.onSearch.emit({ filterValue, ...event });
    }

    private formTextFromTextArray(filters: PLTableFilter[]) {
        filters.forEach((filter: PLTableFilter) => {
            if (filter.textArray) {
                filter.text = filter.textArray.join(this.multipleValuesDelimiter);
            }
        });
        return filters;
    }

    private query() {
        this.filtersPrimary = this.formTextFromTextArray(this.filtersPrimary);
        this.filtersSecondary = this.formTextFromTextArray(this.filtersSecondary);
        this.plTableFramework.updateSomeFilters(this.filters());
        const query = this.plTableFramework.formQuery();
        const queryInfo = { data: {}, query: query };
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }

    toggleSecondary(evt: any) {
        this.secondaryVisible = !this.secondaryVisible;
        this.classes.secondaryVisible = this.secondaryVisible;
    }
}
