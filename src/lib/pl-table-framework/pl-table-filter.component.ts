import { Component, Output, EventEmitter } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';
import { PLTableFilter } from './pl-table-filter';

@Component({
    selector: 'pl-table-filter',
    templateUrl: './pl-table-filter.component.html',
    styleUrls: ['./pl-table-filter.component.less'],
    inputs: ['model', 'filter'],
})
export class PLTableFilterComponent {
    @Output() onQuery = new EventEmitter<any>();
    @Output() modelChange = new EventEmitter<any>();

    model: any = '';
    filter: PLTableFilter;

    private initedFilterValues: any[] = [];
    private inited: boolean = false;
    private skipModelUpdate: boolean = false;
    private timeoutSkipModelUpdate: any = false;

    constructor(private plTableFramework: PLTableFrameworkService,
        private plTableFilters: PLTableFiltersService) {
        plTableFramework.filtersUpdated$.subscribe((filterValues: any) => {
            this.initedFilterValues = filterValues;
            this.setFilterFromUpdate(filterValues);
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
            this.setFilterFromUpdate(this.initedFilterValues);
            // Reset.
            this.initedFilterValues = [];
        } else {
            if (!this.skipModelUpdate && changes.model) {
                this.filter.text = this.model;
                this.updateAndQuery();
            }
        }
        // this.setFilterDefaults();
    }

    setFilterFromUpdate(filterValues: any[] = []) {
        // Avoid inifinte loop; skip the onChanges this will trigger.
        this.skipModelUpdate = true;
        if (this.timeoutSkipModelUpdate) {
            clearTimeout(this.timeoutSkipModelUpdate);
        }
        this.timeoutSkipModelUpdate = setTimeout(() => {
            this.skipModelUpdate = false;
        }, 1000);

        for (let ii = 0; ii < filterValues.length; ii++) {
            if (filterValues[ii].value === this.filter.value) {
                let filterValue = filterValues[ii];
                let isArrayKey = this.filter.selectOptsMulti || this.filter.selectOptsMultiApi
                 || this.filter.selectOptsCheckbox;
                let val = isArrayKey ? filterValue.text.split(',') : filterValue.text;
                if (isArrayKey) {
                    this.filter.textArray = val;
                } else {
                    this.filter.text = val;
                }
                this.updateModel(this.filter.text);
            }
        }
    }

    updateModel(value: any) {
        this.model = value;
        this.modelChange.emit(this.model);
    }

    updateAndQuery() {
        const ret = this.plTableFilters.updateOneFilterWithQuery(this.filter);
        this.filter = ret.filter;
        const queryInfo = ret.queryInfo;
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }
}
