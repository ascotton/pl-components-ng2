import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PLLodashService } from '../pl-lodash';

import { PLTableFilter } from './pl-table-filter';

interface FilterValue {
    value: string;
    text: string;
}

interface FilterValueMap {
    filter: PLTableFilter;
    value: FilterValue;
}

@Injectable()
export class PLTableFrameworkService {
    // Each key is an order value. It's value is either ascending or descending (or empty).
    orderDirection: any = {};
    orderDescendingPrefix: string = '-';
    orderKey = 'ordering';
    orderDelimiter = ',';
    orderDirectionUpdatedSource = new Subject<any>();
    orderDirectionUpdated$ = this.orderDirectionUpdatedSource.asObservable();

    currentPage: number = 1;
    pageSize: number = 25;
    offset: number = 0;
    pageSizeKey: string = 'limit';
    pageNumberKey: string = 'page';
    offsetKey: string = 'offset';
    pagingUpdatedSource = new Subject<any>();
    pagingUpdated$ = this.pagingUpdatedSource.asObservable();

    filterValues: FilterValue[] = [];
    filtersUpdatedSource = new Subject<any>();
    filtersUpdated$ = this.filtersUpdatedSource.asObservable();

    queryDebounceTime: number = 500;
    queryTimeoutTrigger: any = false;
    queryUpdatedSource = new Subject<any>();
    queryUpdated$ = this.queryUpdatedSource.asObservable();

    inited = {
        order: false,
        paging: false,
        firstLoad: false,
    };

    constructor(private plLodash: PLLodashService) { }

    updateQuery(queryInfo: any) {
        if (this.queryTimeoutTrigger) {
            clearTimeout(this.queryTimeoutTrigger);
        }
        this.queryTimeoutTrigger = setTimeout(() => {
            if (!queryInfo.data) {
                queryInfo.data = this.getData();
            }
            queryInfo.queryParams = this.getQueryParams(queryInfo.query);
            this.queryUpdatedSource.next(queryInfo);
        }, this.queryDebounceTime);
    }

    updateQueryFromParams(query: any) {
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let pageSizeChanged: boolean = false;
        let currentPageChanged: boolean = false;
        let orderVals: string[] = [];
        let orderChanged: boolean = false;
        let filterValues: FilterValue[] = [];
        let filterChanged: boolean = false;
        for (let key in query) {
            let type = this.getTypeFromKey(key);
            if (type === 'pageSize') {
                pageSize = parseInt(query[key], 10);
                pageSizeChanged = true;
            } else if (type === 'pageNumber') {
                currentPage = parseInt(query[key], 10);
                currentPageChanged = true;
            } else if (type === 'order') {
                this.resetOrder();
                const orderValues = query[key].split(this.orderDelimiter);
                orderValues.forEach((orderValue: string) => {
                    let orderValueInfo = this.getOrderValueInfo(orderValue);
                    this.orderDirection[orderValueInfo.value] = orderValueInfo.direction;
                });
                orderChanged = true;
            } else if (type === 'filter') {
                filterValues.push({
                    value: key,
                    text: query[key],
                });
                filterChanged = true;
            }
        }
        if (pageSizeChanged || currentPageChanged) {
            this.updatePaging(pageSize, currentPage);
        }
        if (orderChanged) {
            this.updateOrderDirection();
        }
        if (filterChanged) {
            this.updateFilters(filterValues);
        }
    }

    getQueryParams(query: any) {
        const queryParams: any[] = [];
        for (let key in query) {
            let type = this.getTypeFromKey(key);
            if (type) {
                queryParams.push({
                    key: key,
                    value: query[key],
                    type: type,
                });
            }
        }
        return queryParams;
    }

    getTypeFromKey(key: string) {
        const keysMap = {
            pageSizeKey: 'pageSize',
            pageNumberKey: 'pageNumber',
            orderKey: 'order',
        };
        for (let keyVal in keysMap) {
            if (this[keyVal] === key) {
                return keysMap[keyVal];
            }
        }
        if (key === this.offsetKey) {
            return '';
        }
        // return '';
        // Everything else is a filter.
        return 'filter';
    }

    getData() {
        return {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            offset: this.offset,
            orderDirection: this.orderDirection,
        };
    }

    addOrderDirection(key: string, defaultValue: string) {
        this.orderDirection[key] = defaultValue;
        this.inited.order = true;
        this.initialLoadQuery();
    }

    // Filters get all the left over keys so if keys change, we need
    // to remove these keys that are not really filters.
    // checkFilterValues() {
    //     this.filterValues.forEach((filterValue: FilterValue) => {
    //         if
    //         query[filterValue.value] = filterValue.text;
    //     });
    // }

    setKeys(keys: any, keyList: string[]) {
        const filterKeysToDelete: string[] = [];
        keyList.forEach((key: string) => {
            if (keys[key] !== undefined) {
                this[key] = keys[key];
                // Filters get all the left over keys so if keys change, we need
                // to remove these keys that are not really filters.
                let length = this.filterValues.length;
                for (let ff = (length - 1); ff >= 0; ff--) {
                    if (this.filterValues[ff].value === keys[key]) {
                        this.filterValues.splice(ff, 1);
                    }
                }
            }
        });
    }

    setOrderKeys(keys: any) {
        const keyList: string[] = ['orderDescendingPrefix', 'orderKey', 'orderDelimiter'];
        this.setKeys(keys, keyList);
    }

    setPagingKeys(keys: any) {
        const keyList: string[] = ['pageSizeKey', 'pageNumberKey', 'offsetKey'];
        this.setKeys(keys, keyList);
    }

    getOrderValueInfo(orderVal: string) {
        const orderInfo = {
            value: orderVal,
            direction: 'ascending',
        };
        const descendingPrefix = orderVal.slice(0, this.orderDescendingPrefix.length);
        if (descendingPrefix === this.orderDescendingPrefix) {
            orderInfo.value = orderVal.slice(this.orderDescendingPrefix.length, orderVal.length);
            orderInfo.direction = 'descending';
        }
        return orderInfo;
    }

    resetOrder() {
        for (let xx in this.orderDirection) {
            this.orderDirection[xx] = '';
        }
    }

    formOrderQuery(dataInfo: any) {
        // Reset ordering - un order all but the current one, which we set.
        for (let xx in this.orderDirection) {
            this.orderDirection[xx] = (xx === dataInfo.orderKey) ? dataInfo.orderDirection : '';
        }
        const prefix = (dataInfo.orderDirection === 'descending') ? this.orderDescendingPrefix : '';
        return `${prefix}${dataInfo.orderKey}`;
    }

    setOrderQuery(query: any = {}) {
        let orderVals: string[] = [];
        for (let xx in this.orderDirection) {
            if (this.orderDirection[xx] === 'ascending') {
                orderVals.push(xx);
            } else if (this.orderDirection[xx] === 'descending') {
                orderVals.push(`${this.orderDescendingPrefix}${xx}`);
            }
        }
        if (orderVals.length) {
            query[this.orderKey] = orderVals.join(this.orderDelimiter);
        }
        return query;
    }

    formAndUpdateOrderQuery(dataInfo: any) {
        const orderQuery = this.formOrderQuery(dataInfo);
        this.updateOrderDirection();
        return orderQuery;
    }

    updateOrderDirection() {
        this.orderDirectionUpdatedSource.next(this.orderDirection);
    }

    updatePagingEmit() {
        this.pagingUpdatedSource.next({
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            offset: this.offset,
        });
    }

    updatePaging(pageSize: number, currentPage: number) {
        this.pageSize = pageSize;
        this.currentPage = currentPage;
        this.offset = pageSize * (currentPage - 1);
        this.inited.paging = true;
        this.initialLoadQuery();
        this.updatePagingEmit();
    }

    setPagingQuery(query: any = {}) {
        query[this.pageSizeKey] = this.pageSize;
        query[this.pageNumberKey] = this.currentPage;
        query[this.offsetKey] = this.offset;
        return query;
    }

    updateOneFilter(filter: any, emitUpdate: boolean = true) {
        let index;
        // Add filter
        if (filter.text !== undefined && filter.text !== '') {
            index = this.plLodash.findIndex(this.filterValues, 'value', filter.value);
            if (index > -1) {
                this.filterValues[index].text = filter.text;
            } else {
                this.filterValues.push({
                    value: filter.value,
                    text: filter.text,
                });
            }
            // Remove filter
        } else {
            index = this.plLodash.findIndex(this.filterValues, 'value', filter.value);
            if (index > -1) {
                this.filterValues.splice(index, 1);
            }
        }
        if (emitUpdate) {
            this.updateFiltersEmit();
        }
    }

    updateSomeFilters(filters: any[]) {
        filters.forEach((filter: any) => {
            this.updateOneFilter(filter, false);
        });
        this.updateFiltersEmit();
    }

    updateFilters(filters: any[]) {
        const filterValues: FilterValue[] = [];
        filters.forEach((filter: any) => {
            if (filter.text !== undefined && filter.text !== '') {
                filterValues.push({
                    value: filter.value,
                    text: filter.text,
                });
            }
        });
        this.filterValues = filterValues;
        this.updateFiltersEmit();
    }

    updateFiltersEmit() {
        // Initial query is only triggered by order or paging. Order may not be set so it is really
        // paging that triggers the initial load. However, it will be skipped if set from the paging
        // emit as it is here for the filters change. So we need to trigger the initial load
        // just in case.
        // We have to set paging to inited as well otherwise it will do nothing.
        this.inited.paging = true;
        this.initialLoadQuery();
        if (!this.currentPage) this.currentPage = 1;
        this.updatePagingEmit();
        this.filtersUpdatedSource.next(this.filterValues);
    }

    setFilterQuery(query: any = {}) {
        this.filterValues.forEach((filterValue: FilterValue) => {
            query[filterValue.value] = filterValue.text;
        });
        return query;
    }

    formQuery() {
        let query = this.setPagingQuery({});
        query = this.setOrderQuery(query);
        query = this.setFilterQuery(query);
        return query;
    }

    formAndUpdateQuery() {
        const query = this.formQuery();
        this.updateQuery({ query: query });
    }

    initialLoadQuery() {
        if (!this.inited.firstLoad && this.inited.paging && this.inited.order) {
            this.inited.firstLoad = true;
            this.formAndUpdateQuery();
        }
    }

    /*
        returns filter and filter values mapped where filter.value === filterValue.value
    */
    mappedFilterValues(filterOpts: PLTableFilter[], filterValues: any[]): FilterValueMap[] {
        return filterValues.reduce((mappings: FilterValueMap[], filterValue) => {
            const filter = filterOpts.find(f => f.value === filterValue.value);

            return filter ? mappings.concat([{ filter, value: filterValue }]) : mappings;
        }, []);
    }

    /*
        sets filter.value to filterValue.text for each filter/filterValue pair

        Modifies filters in filterValueMaps argument!
    */
    updateFiltersFromValues(filterValueMaps: FilterValueMap[]) {
        filterValueMaps.forEach(({ filter, value }) => {
            const isArrayKey = filter.selectOptsMulti || filter.selectOptsMultiApi || filter.selectOptsCheckbox;

            if (isArrayKey) {
                filter.textArray = value.text.split(',');
            } else {
                filter.text = value.text;
            }
        });
    }

}
