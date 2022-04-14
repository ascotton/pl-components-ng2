import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PLFormatterService } from '../pl-formatter';
import { PLLodashService } from '../pl-lodash';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';
import { PLTableFilter } from './pl-table-filter';

@Component({
    selector: 'pl-table-filters-side',
    templateUrl: './pl-table-filters-side.component.html',
    styleUrls: ['./pl-table-filters-side.component.less'],
    inputs: ['filters', 'filtersVisible', 'multipleValuesDelimiter', 'canCloseFilters'],
})
export class PLTableFiltersSideComponent {
    @Input() queryOnChanges = false;
    @Output() onQuery = new EventEmitter<any>();
    @Output() onSearch = new EventEmitter<any>();
    @Output() onSetModelOptions = new EventEmitter<{ filterValue: string, modelValues: string[]}>();
    @Output() onCloseFilters = new EventEmitter<any>();

    filters: PLTableFilter[] = [];
    filtersVisible: boolean = false;
    multipleValuesDelimiter: string = ',';
    canCloseFilters: boolean = true;

    // filterDefaults: any = {
    //     optionWidth: '100px',
    // };

    private filterTimeout: number = 1000;
    private filterTimeoutTrigger: any = -1;

    private initedFilterValues: any[] = [];
    private inited: boolean = false;

    constructor(
        private plTableFramework: PLTableFrameworkService,
        private plTableFilterService: PLTableFiltersService,
        private plFormatter: PLFormatterService,
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
        if (this.queryOnChanges) {
            console.log('--- SIDE FILTER queryOnChanges', { STATE: this });
            this.query();
        }
    }

    ngOnDestroy() {
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
    }

    setFiltersFromUpdate(filterValues: any[] = []) {
        const filterValueMaps = this.plTableFramework.mappedFilterValues(this.filters, filterValues);

        // modifies this.filters!
        this.plTableFramework.updateFiltersFromValues(filterValueMaps);

        // Always fire update event to catch when last selected item is unselected
        const multiSelectFilters = this.filters.filter(f => f.type === 'multiSelectApi');
        multiSelectFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.textArray || [] });
        });

        const selectApiFilters = this.filters.filter(f => f.type === 'selectApi');
        selectApiFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.text ? [f.text] : [] });
        });
    }

    changeFilter(evt: any) {
        this.onFilter(evt);
    }

    clearAllFilters() {
        this.filters.forEach((filter: any) => {
            if (filter.text !== undefined) {
                filter.text = '';
            }
            if (filter.textArray !== undefined) {
                filter.textArray = [];
            }
        });
        this.changeFilter({});
    }

    clearFiltersButtonLabel(): string {
        return this.plTableFilterService.clearFiltersButtonLabel(this.filters.length);
    }

    closeFilters() {
        this.onCloseFilters.emit();
    }

    private init(onchanges: boolean) {
        if (this.inited && this.initedFilterValues.length) {
            this.setFiltersFromUpdate(this.initedFilterValues);
            // Reset.
            this.initedFilterValues = [];
        }

        // Add type to each filter, if not already defined
        this.filters.forEach((filter) => {
            filter.type = this.plTableFilterService.inferredFilterType(filter);
        });
    }

    private toggleFiltersVisible() {
        this.filtersVisible = !this.filtersVisible;
    }

    private filterKeyup(evt: any) {
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
        const keyCodeEnter = 13;
        if (evt.evt && evt.evt.keyCode === keyCodeEnter) {
            this.onFilter();
        } else {
            this.filterTimeoutTrigger = setTimeout(() => {
                this.onFilter();
            }, this.filterTimeout);
        }
    }

    private onFilter(evt?: any) {
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
        this.filters = this.formTextFromTextArray(this.filters);
        this.plTableFramework.updateSomeFilters(this.filters);
        const query = this.plTableFramework.formQuery();
        const queryInfo = { data: {}, query: query };
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }
}
