/**
Usually can just use pl-table-filter for one filter at a time.
However, if more than one filter updates at the same time, one will
overwrite the values of the other. In that case, use this to update
all of the filters at once.
*/

import { Component, Output, EventEmitter } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';

import { PLLodashService } from '../pl-lodash';
import { PLTableFilter } from './pl-table-filter';

@Component({
    selector: 'pl-table-filter-set',
    templateUrl: './pl-table-filter-set.component.html',
    styleUrls: ['./pl-table-filter-set.component.less'],
    inputs: ['model', 'filters'],
})
export class PLTableFilterSetComponent {
    @Output() onQuery = new EventEmitter<any>();
    @Output() modelChange = new EventEmitter<any>();

    // Object of key value pairs, model key is filter.value and model[key] is filter.text.
    model: any = {};
    filters: PLTableFilter[] = [];

    private initedFilterValues: any[] = [];
    private inited: boolean = false;
    private skipModelUpdate: boolean = false;
    private timeoutSkipModelUpdate: any = false;

    constructor(private plTableFramework: PLTableFrameworkService,
        private plTableFilters: PLTableFiltersService,
        private plLodash: PLLodashService) {
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

    ngOnChanges(changes: any) {
        this.init(true, changes);
    }

    private init(onchanges: boolean, changes: any = {}) {
        if (this.inited && this.initedFilterValues.length) {
            this.setFiltersFromUpdate(this.initedFilterValues);
            // Reset.
            this.initedFilterValues = [];
        } else {
            if (!this.skipModelUpdate && changes.model) {
                for (let key in this.model) {
                    let index = this.plLodash.findIndex(this.filters, 'value', key);
                    if (index > -1) {
                        this.filters[index].text = this.model[key];
                    }
                }
                this.updateAndQuery();
            }
        }
    }

    setFiltersFromUpdate(filterValues: any[] = []) {
        // Avoid inifinte loop; skip the onChanges this will trigger.
        this.skipModelUpdate = true;
        if (this.timeoutSkipModelUpdate) {
            clearTimeout(this.timeoutSkipModelUpdate);
        }
        this.timeoutSkipModelUpdate = setTimeout(() => {
            this.skipModelUpdate = false;
        }, 1000);

        const filterValueMaps = this.plTableFramework.mappedFilterValues(this.filters, filterValues);

        // modifies this.filters!
        this.plTableFramework.updateFiltersFromValues(filterValueMaps);

        filterValueMaps.forEach(({ filter, value }) => this.model[filter.value] = filter.text);

        if (filterValueMaps.length > 0) {
            this.updateModel();
        }
    }

    updateModel() {
        this.modelChange.emit(this.model);
    }

    updateAndQuery() {
        const ret = this.plTableFilters.updateSomeFiltersWithQuery(this.filters);
        this.filters = ret.filters;
        const queryInfo = ret.queryInfo;
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }
}
