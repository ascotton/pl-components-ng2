import { Component, Output, Input, EventEmitter } from '@angular/core';

import { PLLodashService } from '../pl-lodash';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';
import { PLTableFilter } from './pl-table-filter';

@Component({
    selector: 'pl-table-filters-top',
    templateUrl: './pl-table-filters-top.component.html',
    styleUrls: ['./pl-table-filters-top.component.less'],
})
export class PLTableFiltersTopComponent {
    @Output() onQuery = new EventEmitter<any>();
    @Output() onSearch = new EventEmitter<any>();
    @Output() onSetModelOptions = new EventEmitter<{ filterValue: string, modelValues: string[]}>();

    @Input() filterSelectOpts: PLTableFilter[] = [];
    @Input() showClearAllFiltersBar: boolean = true;
    @Input() filtersVisible: boolean = false;
    @Input() filtersFixed: boolean = false;
    @Input() total: number = 0;
    @Input() totalLabel = 'Total';
    @Input() multipleValuesDelimiter: string = ',';

    private filterDefaults: any = {
        defaultVisible: false,
        visible: false,
        noRemove: true,
    };

    private addFilterSelectOpts: any[] = [];
    private addFilterValue: string = '';
    private addFilterVisible: boolean = false;

    private atLeastOneFilter: boolean = false;

    private filterTimeout: number = 1000;
    private filterTimeoutTrigger: any = -1;

    private classesClearFilters: any = {};
    private classesAddFilter: any = {};

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

    clearFiltersButtonLabel(): string {
        return this.plTableFilterService.clearFiltersButtonLabel(this.visibleFilters().length);
    }

    setDefaults() {
        if (!this.total) {
            this.total = 0;
        }
    }

    setFiltersFromUpdate(filterValues: any[] = []) {
        const filterValueMaps = this.plTableFramework.mappedFilterValues(this.filterSelectOpts, filterValues);

        // modifies this.filterSelectOpts!
        this.plTableFramework.updateFiltersFromValues(filterValueMaps);

        // Always fire update event to catch when last selected item is unselected
        const multiSelectFilters = this.filterSelectOpts.filter(f => f.type === 'multiSelectApi');
        multiSelectFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.textArray || [] });
        });

        const selectApiFilters = this.filterSelectOpts.filter(f => f.type === 'selectApi');
        selectApiFilters.forEach((f) => {
            this.onSetModelOptions.emit({ filterValue: f.value, modelValues: f.text ? [f.text] : [] });
        });

        const filtersToSet = filterValueMaps.map((filterValueMap) => {
            return Object.assign({}, this.filterDefaults, filterValueMap.filter);
        });

        if (filtersToSet.length > 0) {
            this.addFilters(filtersToSet, false);
        }
    }

    private init(onchanges: boolean) {
        if (this.inited && this.initedFilterValues.length) {
            this.setFiltersFromUpdate(this.initedFilterValues);
            // Reset.
            this.initedFilterValues = [];
        }

        // Add type to each filter, if not already defined
        this.filterSelectOpts.forEach((filter) => {
            filter.type = this.plTableFilterService.inferredFilterType(filter);
        });

        this.setDefaults();
        this.setFilterSelectOpts(onchanges);
        this.setAtLeastOneFilter();
    }

    private setFilterSelectOpts(onchanges: boolean) {
        let atLeastOneFilter = false;
        const filtersToSet: any[] = [];
        this.filterSelectOpts.forEach((filterOpt: PLTableFilter, indexOpt: number) => {
            for (let key in this.filterDefaults) {
                this.filterSelectOpts[indexOpt][key] = (filterOpt[key] !== undefined ?
                 filterOpt[key] : this.filterDefaults[key]);
            }
            atLeastOneFilter = true;
            if (filterOpt.defaultVisible) {
                filtersToSet.push(filterOpt);
            }
            return filterOpt;
        });
        if (atLeastOneFilter) {
            this.addFilters(filtersToSet, onchanges);
        }
        this.setAddFilterSelectOpts();
    }

    private setAddFilterSelectOpts() {
        const opts: any = [];
        let index: number;
        // Go through all available filters and disable if currently visible.
        let curOpt: any;
        this.filterSelectOpts.forEach((filterOpt: any) => {
            opts.push({
                value: filterOpt.value,
                label: filterOpt.label,
                disabled: filterOpt.visible,
            });
        });
        this.addFilterSelectOpts = opts;
        this.classesAddFilter.canAdd = this.addFilterSelectOpts.length ? true : false;
    }

    private addFilters(filters: PLTableFilter[], onchanges: boolean = false) {
        filters.forEach((filter: PLTableFilter) => {
            this.addFilter(filter);
        });
        if (!onchanges) {
            this.filtersVisible = true;
        }
    }

    private addFilter(filter: PLTableFilter) {
        const index = this.plLodash.findIndex(this.filterSelectOpts, 'value', filter.value);
        if (!this.filterSelectOpts[index].visible) {
            this.filterSelectOpts[index].visible = true;
            return true;
        }
        return false;
    }

    private addFilterOptChange(filterValue1: string = null) {
        const filterToAdd = filterValue1 ? filterValue1 : this.addFilterValue;
        const index = this.plLodash.findIndex(this.addFilterSelectOpts, 'value', filterToAdd);
        const filter = this.addFilterSelectOpts[index];
        const added = this.addFilter(filter);
        if (added) {
            // Do not filter yet as there is no filter value so query will be the same as before.
            // this.onFilter();
            this.setAddFilterSelectOpts();
            this.toggleAddFilterVisible();
            this.addFilterValue = '';
            this.filtersVisible = true;
            this.setAtLeastOneFilter();
        }
    }

    private toggleFiltersVisible() {
        this.filtersVisible = !this.filtersVisible;
    }

    private toggleAddFilterVisible() {
        if (this.addFilterVisible || this.addFilterSelectOpts.length) {
            this.addFilterVisible = !this.addFilterVisible;
        }
    }

    private removeColFilterDefaultVisible(filterValue: string) {
        // Remove default visible otherwise it will just come back.
        const index = this.plLodash.findIndex(this.filterSelectOpts, 'value', filterValue);
        if (index > -1) {
            this.filterSelectOpts[index].defaultVisible = false;
        }
    }

    private unsetFilter(filter: any) {
        if (filter.text !== undefined) {
            filter.text = '';
        }
        if (filter.textArray !== undefined) {
            filter.textArray = [];
        }
    }

    private removeFilter(index: number, filter: any) {
        this.filterSelectOpts[index].visible = false;
        this.removeColFilterDefaultVisible(filter.value);
        // Only re-query if we had text in the filter we removed.
        if (filter.text || filter.textArray) {
            this.onFilter();
        }
        this.unsetFilter(filter);
        this.setAddFilterSelectOpts();
    }

    private setAtLeastOneFilter() {
        let atLeastOneFilter = false;
        this.filterSelectOpts.forEach((filter: any) => {
            if (filter.visible) {
                atLeastOneFilter = true;
            }
        });
        this.atLeastOneFilter = atLeastOneFilter;
        this.classesClearFilters.hasFilter = this.atLeastOneFilter;
    }

    private clearAllFilters() {
        if (this.atLeastOneFilter) {
            this.filterSelectOpts.forEach((filter: any) => {
                if (!filter.noRemove) {
                    this.removeColFilterDefaultVisible(filter.value);
                    filter.visible = false;
                }
                this.unsetFilter(filter);
            });
            this.setAddFilterSelectOpts();
            this.onFilter();
        }
    }

    filterKeyup(evt: any) {
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
        this.setAtLeastOneFilter();
        // if (this.atLeastOneFilter) {
        const filters = this.formTextFromTextArray(this.filterSelectOpts);
        this.plTableFramework.updateSomeFilters(filters);
        const query = this.plTableFramework.formQuery();
        const queryInfo = { data: {}, query: query };
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
        // }
    }

    visibleFilters(): PLTableFilter[] {
        return this.filterSelectOpts.filter((filter: PLTableFilter) => filter.visible);
    }
}
