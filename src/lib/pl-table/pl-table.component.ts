/**
Improvements / ideas as needed:
    - caching + abstract local table version to service
    - dynamic component renderer? e.g. to get icons to show up?
        - https://github.com/angular/angular/issues/9599
*/

import { Component, Input, Output, EventEmitter, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PLFormatterService } from '../pl-formatter';
import { PLLodashService } from '../pl-lodash/pl-lodash.service';

import { PLTableService } from './pl-table.service';

interface DataMeta {
    pageSize?: any;
    pageSizeKey?: string;
    pageNumberKey?: string;
    count?: number;
    currentPage?: number;
    totalPages?: number;
}
interface ColumnDefaults {
    filterable?: boolean;
    orderable?: boolean;
    click?: boolean;
    classesBody?: any;
    filterDefaultVisible?: boolean;
    filterNoRemove?: boolean;
}
interface ClassesRow {
    click?: boolean;
}

@Component({
    selector: 'pl-table',
    templateUrl: './pl-table.component.html',
    styleUrls: ['./pl-table.component.less'],
    inputs: [
        'data',
        'columns',
        'columnDefaults',
        'pageSize',
        'count',
        'queryId',
        'pageSizeKey',
        'pageNumberKey',
        'orderKey',
        'cardsWidth',
        'cardMaxWidth',
        'reQuery',
        'expandRowHtmlFn',
        'showClearAllFiltersBar',
        'filtersVisible',
        'fixedHeaderTop',
        'stateName',
        'queryThrottle',
        'rowHrefFn',
        'alwaysShowFooter',
        'emptyDisplay', // table-wide value to use to display when a field is null or ''
        'noResultsText',
    ],
})
export class PLTableComponent {
    @ViewChild('headerEle') headerEle: ElementRef;
    @ViewChild('headerSpacerEle') headerSpacerEle: ElementRef;
    @ViewChild('containerEle') containerEle: ElementRef;

    @Output() onQuery = new EventEmitter<any>();
    @Output() onRowClick = new EventEmitter<any>();
    @Output() onColumnClick = new EventEmitter<any>();

    /**
    Array of objects (one per row) of the raw data.
    [
        { first: 'joe', zip: 12345, unused: 'one' },
        { first: 'bob', zip: 23456, unused: 'two' },
    ]
    */

    data: any = [];
    pageSize: number = 25;
    pageSizeKey: string = 'limit';
    pageNumberKey: string = 'page';
    count: number = 0;
    queryId: string = '';
    orderKey: string = 'ordering';
    cardsWidth: number = 650;
    cardMaxWidth: number = 300;
    reQuery: boolean = false;
    columnDefaults: ColumnDefaults = {};
    emptyDisplay: string = null;
    noResultsText: string = 'No Results Available.';
    /**
    Array of objects (one per column) with the fields in columnDefaults plus:
    title: string, defaults to data
    dataKey: string
    dataDisplay: function that gets the data and returns a string to display
    filterSearchKey: string if the key (for the api call) is different than the dataKey
    filterTitle: string that, if set, will overwrite `title` for what to display in the filter dropdown
    filterSelectOpts: array of `value` and `label` options to show a dropdown instead of a text field.
    filterDefaultVisible: boolean true to add this filter when the table loads
    filterNoRemove: boolean true to prevent removing this filter
    orderValue: string if the key (for the api call) is different than the dataKey
    orderDirection: string = 'ascending', 'descending'
    click: boolean: false - true to pass click events through to `onColumnClick`
    htmlFn: function(rowData, colData)
    emptyDisplay: string to display if a field value is null or undefined
    [
        { dataKey: 'zip', filterable: false, orderable: false, title: 'Zip Code' },
        { dataKey: 'first' },
    ]
    */
    columns: any = null;
    expandRowHtmlFn: any = null;
    showClearAllFiltersBar: boolean = true;
    filtersVisible: boolean = false;
    fixedHeaderTop: number = -1;
    stateName: string = '';
    queryThrottle: number = 500;
    rowHrefFn: any = null;
    alwaysShowFooter: boolean = true;

    /**
    [
        { cols:  [12345, 'joe'], expand: 'expand html', href: '/link1', hrefQueryParams: {} },
        { cols: [23456, 'bob'], expand: 'expand html2' },
    ]
    */
    dataDisplay: any = [];
    dataMeta: DataMeta = {
        currentPage: 1,
        totalPages: 1,
    };

    private currentQueryId: string = '';

    filterSelectOpts: any[] = [];
    private addFilterSelectOpts: any[] = [];
    private addFilterColumn: string = '';
    private addFilterVisible: boolean = false;

    /**
    [
        { column: '', title: '', seachKey: '' text: '', selectOpts: '' }
    ]
    */
    private filters: any[] = [];
    private atLeastOneFilter: boolean = false;
    // filterText: string = '';
    // filterColumn: string = '';
    // currentFilterSelectOpts: any[] = [];
    filterTimeout: number = 1000;
    filterTimeoutTrigger: any = -1;

    private queryTimeoutTrigger: any = false;

    orderDescendingPrefix: string = '-';
    orderDelimiter: string = ',';

    classesRow: ClassesRow = {};
    classesCards: any = {
        table: false,
        cards: true,
    };
    stylesRow: any = {
        maxWidth: 'none',
    };
    private classesClearFilters: any = {};
    private classesAddFilter: any = {};
    stylesHeader: any = {};
    classesHeaderRow: any = {};
    stylesHeaderSpacer: any = {
        height: 0,
    };
    loading: boolean = true;
    private queryParams: any = null;
    private queryParamsUsed: boolean = false;
    private currentQueryParams: any[] = [];
    private currentPage: number = this.dataMeta.currentPage;

    private pageSizeOpts: any[] = [];
    // private pageSizeMin: number = 5;
    // private pageSizeMax: number = 100;
    // private pageSizeStep: number = 5;
    private currentPageSize: number = this.pageSize;
    private pageArrowsDisabled: any = {
        prev: false,
        next: false,
    };

    private keycodes: any = {
        enter: 13,
    };

    constructor(
        private sanitizer: DomSanitizer,
        private plFormatter: PLFormatterService,
        private plLodash: PLLodashService,
        private plTable: PLTableService
    ) {}

    ngOnInit() {
        this.init();
        if (this.stateName) {
            this.plTable.getStateFromUrl(this.stateName).subscribe((res: any) => {
                this.queryParams = res.query;
                this.queryParamsUsed = false;
                this.updateForQueryParams(this.queryParams);
                this.query();
            });
        } else {
            this.query();
        }
    }

    ngOnDestroy() {
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
    }

    ngOnChanges(changes: any) {
        // Want to use the most recent query only, to avoid a first, but slower,
        // query from being displayed.
        if (
            !changes['queryId'] ||
            !changes['queryId'].currentValue ||
            changes['queryId'].currentValue === this.currentQueryId
        ) {
            this.init(true);
            this.onScroll();
            let updated: boolean = false;
            if (this.stateName) {
                if (!changes['data']) {
                    this.queryParamsUsed = false;
                }
                updated = this.updateForQueryParams(this.queryParams);
            }
            if (changes['reQuery'] || updated) {
                this.query();
            }
        }
    }

    ngAfterViewInit() {
        this.onScroll();
    }

    init(onchanges: boolean = false) {
        this.setDataMeta();
        this.setPageSizeOpts();
        this.setColumns();
        this.setFilterSelectOpts(onchanges);
        // this.setCurrentFilterSelectOpts();
        this.setDataDisplay();
        this.setAtLeastOneFilter();
        this.onResize();
    }

    private setPageSizeOpts() {
        const opts: any[] = [];
        let foundCurrentValue: boolean = false;
        // for (let ii = this.pageSizeMin; ii <= this.pageSizeMax; ii = (ii + this.pageSizeStep)) {
        // if (!foundCurrentValue && ii > parseInt(this.dataMeta.pageSize, 10)) {
        //     opts.push({ value: this.dataMeta.pageSize, label: this.dataMeta.pageSize });
        //     foundCurrentValue = true;
        // }
        // opts.push({ value: ii, label: ii });
        // if (ii === parseInt(this.dataMeta.pageSize, 10)) {
        //     foundCurrentValue = true;
        // }
        // }
        const sizes = [5, 10, 25, 50, 100];
        for (let ii = 0; ii < sizes.length; ii++) {
            if (!foundCurrentValue && sizes[ii] > parseInt(this.dataMeta.pageSize, 10)) {
                opts.push({
                    value: this.dataMeta.pageSize,
                    label: this.dataMeta.pageSize,
                });
                foundCurrentValue = true;
            }
            opts.push({ value: sizes[ii], label: sizes[ii] });
            if (sizes[ii] === parseInt(this.dataMeta.pageSize, 10)) {
                foundCurrentValue = true;
            }
        }
        this.pageSizeOpts = opts;
    }

    private setColumns() {
        this.columnDefaults = Object.assign(
            {},
            {
                filterable: true,
                orderable: true,
                click: false,
            },
            this.columnDefaults
        );
        this.columnDefaults.classesBody = { click: this.columnDefaults.click };
        if (!this.columns || !this.columns.length) {
            // Go through first data item and use all fields.
            if (this.data && this.data.length && this.data[0]) {
                this.columns = [];
                for (let field in this.data[0]) {
                    this.columns.push(
                        Object.assign({}, this.columnDefaults, {
                            title: field,
                            dataKey: field,
                            classesHeader: {},
                        })
                    );
                }
            } else {
                this.columns = [];
            }
        } else {
            let curCol: any;
            this.columns = this.columns.map((col: any) => {
                if (!col.title) {
                    col.title = col.dataKey;
                }
                curCol = Object.assign({}, this.columnDefaults, col);
                curCol.classesBody = { click: col.click };
                curCol.classesHeader = {
                    orderable: col.orderable,
                    sorted: col.orderDirection,
                };
                return curCol;
            });
        }
    }

    private setDataDisplay() {
        this.classesRow.click = this.onRowClick.observers.length ? true : false;
        if (!this.data || !this.data.length) {
            this.dataDisplay = [];
        } else {
            let rowData: any;
            this.dataDisplay = this.data.map((row: any) => {
                rowData = {
                    expand: null,
                    href: null,
                    hrefQueryParams: null,
                };
                if (this.expandRowHtmlFn) {
                    rowData.expand = this.sanitizer.bypassSecurityTrustHtml(this.expandRowHtmlFn(row));
                }
                if (this.rowHrefFn) {
                    const rowHrefInfo = this.rowHrefFn(row);
                    rowData.href = rowHrefInfo.href;
                    rowData.hrefQueryParams = rowHrefInfo.hrefQueryParams;
                }
                rowData.cols = this.columns.map((col: any) => {
                    if (col.htmlFn) {
                        return this.sanitizer.bypassSecurityTrustHtml(col.htmlFn(row, col));
                    } else {
                        let rowValue = row[col.dataKey];
                        if ((rowValue == null || rowValue === '') && (this.emptyDisplay || col.emptyDisplay)) {
                            rowValue = col.emptyDisplay ? col.emptyDisplay : this.emptyDisplay;
                        }
                        return rowValue;
                    }
                });
                return rowData;
            });
        }
        this.loading = false;
    }

    private setFilterSelectOpts(onchanges: boolean) {
        const opts: any[] = [
            // { value: '', label: '[any column]'}
        ];
        let atLeastOneFilter = false;
        let opt: any = {};
        const filtersToSet: any[] = [];
        this.columns.forEach((col: any) => {
            if (col.filterable) {
                atLeastOneFilter = true;
                opt = {
                    value: col.dataKey,
                    label: col.filterTitle || col.title,
                    filterSearchKey: col.filterSearchKey ? col.filterSearchKey : col.dataKey,
                };
                if (col.filterSelectOpts) {
                    opt.filterSelectOpts = col.filterSelectOpts;
                }
                opts.push(opt);
                if (col.filterDefaultVisible) {
                    filtersToSet.push({
                        column: opt.value,
                        noRemove: col.filterNoRemove !== undefined ? col.filterNoRemove : true,
                    });
                }
            }
        });
        if (atLeastOneFilter) {
            this.filterSelectOpts = opts;
            // if (!this.filterColumn) {
            //     this.filterColumn = opts[0].value;
            // }
            this.addFilters(filtersToSet, onchanges);
        } else {
            this.filterSelectOpts = [];
        }
        this.setAddFilterSelectOpts();
    }

    private setAddFilterSelectOpts() {
        const opts: any = [];
        let index: number;
        // Go through all available filters and copy over / enable the ones that are NOT current filters.
        let curOpt: any;
        this.filterSelectOpts.forEach((filterOpt: any) => {
            index = this.plLodash.findIndex(this.filters, 'column', filterOpt.value);
            curOpt = Object.assign({}, filterOpt);
            if (index >= 0) {
                curOpt.disabled = true;
            }
            opts.push(curOpt);
        });
        this.addFilterSelectOpts = opts;
        this.classesAddFilter.canAdd = this.addFilterSelectOpts.length ? true : false;
    }

    private addFilters(filterColumns: any[], onchanges: boolean = false) {
        filterColumns.forEach((filterColumn: any) => {
            this.addFilter(filterColumn);
        });
        if (!onchanges) {
            this.filtersVisible = true;
        }
    }

    private addFilter(newFilter1: any = {}) {
        const columnToAdd = newFilter1.column ? newFilter1.column : this.addFilterColumn;
        const text = newFilter1.text ? newFilter1.text : '';
        const noRemove = newFilter1.noRemove !== undefined ? newFilter1.noRemove : true;
        const index = this.plLodash.findIndex(this.filterSelectOpts, 'value', columnToAdd);
        const indexFilter = this.plLodash.findIndex(this.filters, 'column', columnToAdd);
        if (index > -1 && indexFilter < 0) {
            let filterOpt = this.filterSelectOpts[index];
            let newFilter = {
                column: filterOpt.value,
                title: filterOpt.label,
                searchKey: filterOpt.filterSearchKey,
                text: text,
                selectOpts: filterOpt.filterSelectOpts,
                noRemove: noRemove,
            };
            this.filters.push(newFilter);
            return true;
        }
        return false;
    }

    private addFilterColumnChange(column1: string = null) {
        const columnToAdd = column1 ? column1 : this.addFilterColumn;
        const added = this.addFilter({ column: columnToAdd });
        if (added) {
            // Do not filter yet as there is no filter value so query will be the same as before.
            // this.onFilter();
            this.setAddFilterSelectOpts();
            this.toggleAddFilterVisible();
            this.addFilterColumn = '';
            this.filtersVisible = true;
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

    private removeColFilterDefaultVisible(filterColumn: string) {
        // Remove col.filterDefaultVisible otherwise it will just come back.
        const indexCol = this.plLodash.findIndex(this.columns, 'dataKey', filterColumn);
        if (indexCol > -1) {
            this.columns[indexCol].filterDefaultVisible = false;
        }
    }

    private removeFilter(index: number, filter: any) {
        this.filters.splice(index, 1);
        this.removeColFilterDefaultVisible(filter.column);
        // Only re-query if we had text in the filter we removed.
        if (filter.text) {
            this.onFilter();
        }
        this.setAddFilterSelectOpts();
    }

    // private setCurrentFilterSelectOpts() {
    //     for (let ii = 0; ii < this.filterSelectOpts.length; ii++) {
    //         if (this.filterSelectOpts[ii].value === this.filterColumn) {
    //             if (this.filterSelectOpts[ii].filterSelectOpts) {
    //                 this.currentFilterSelectOpts = this.filterSelectOpts[ii].filterSelectOpts;
    //             } else {
    //                 this.currentFilterSelectOpts = [];
    //             }
    //             break;
    //         }
    //     }
    // }

    private setDataMeta() {
        this.dataMeta = Object.assign({}, this.dataMeta, {
            count: this.count,
            pageSize: this.pageSize,
            pageSizeKey: this.pageSizeKey,
            pageNumberKey: this.pageNumberKey,
        });
        // If we got back more data than a page size, assume no paging was done and show all.
        let dataLength = this.data && this.data.length ? this.data.length : 0;
        const dataBiggerThanPageSize = dataLength > this.dataMeta.count ? true : false;
        if (!this.dataMeta.count && this.data && this.data.length) {
            this.dataMeta.count = this.data.length;
        }
        if (this.dataMeta.count && !dataBiggerThanPageSize && this.dataMeta.count > this.dataMeta.pageSize) {
            this.dataMeta.totalPages = Math.ceil(this.dataMeta.count / this.dataMeta.pageSize);
        } else {
            this.dataMeta.totalPages = 1;
            this.resetPaging();
        }
        this.setPagingDisabled();
    }

    private resetPaging() {
        this.dataMeta.currentPage = 1;
        this.setCurrentPage();
    }

    private setCurrentPage() {
        this.currentPage = this.dataMeta.currentPage;
        this.setPagingDisabled();
    }

    private setPagingDisabled() {
        this.pageArrowsDisabled.prev = this.dataMeta.currentPage === 1 ? true : false;
        this.pageArrowsDisabled.next = this.dataMeta.currentPage === this.dataMeta.totalPages ? true : false;
    }

    private resetOrdering() {
        this.columns.forEach((col: any) => {
            if (col.orderDirection) {
                delete col.orderDirection;
                col.classesHeader.sorted = false;
            }
        });
    }

    private setQueryFilter(query: any) {
        let filterKey: string;
        this.setAtLeastOneFilter();
        if (this.atLeastOneFilter) {
            // this.columns.forEach((col: any) => {
            //     if (col.dataKey === this.filterColumn) {
            //         filterKey = col.filterSearchKey ? col.filterSearchKey : col.dataKey;
            //         query[filterKey] = this.filterText;
            //     }
            // });
            this.filters.forEach((filter: any) => {
                filterKey = filter.searchKey;
                query[filterKey] = filter.text;
                this.currentQueryParams.push({
                    key: filter.column,
                    value: filter.text,
                    type: 'filter',
                });
            });
        }
        return query;
    }

    private setQueryPaging(query: any) {
        query[this.dataMeta.pageSizeKey] = this.dataMeta.pageSize;
        query[this.dataMeta.pageNumberKey] = this.dataMeta.currentPage;
        this.currentQueryParams.push({
            key: this.dataMeta.pageSizeKey,
            value: this.dataMeta.pageSize,
            type: 'pageSize',
        });
        this.currentQueryParams.push({
            key: this.dataMeta.pageNumberKey,
            value: this.dataMeta.currentPage,
            type: 'pageNumber',
        });
        return query;
    }

    private setQueryOrder(query: any) {
        let orderVal: string;
        let orderVals: string[] = [];
        this.columns.forEach((col: any) => {
            orderVal = col.orderValue ? col.orderValue : col.dataKey;
            if (col.orderDirection === 'ascending') {
                orderVals.push(orderVal);
            } else if (col.orderDirection === 'descending') {
                orderVals.push(`${this.orderDescendingPrefix}${orderVal}`);
            }
        });
        if (orderVals.length) {
            query[this.orderKey] = orderVals.join(this.orderDelimiter);
            this.currentQueryParams.push({
                key: this.orderKey,
                value: query[this.orderKey],
                type: 'order',
            });
        }
        return query;
    }

    /**
    This does the reverse of the set query functions. It takes query params and sets variables.
    It's similar to manually triggering any of these changes.
    */
    private updateForQueryParams(query: any) {
        if (!this.queryParamsUsed && this.queryParams && this.columns.length) {
            this.queryParamsUsed = true;
            let col: any;
            const filtersToSet: any[] = [];
            for (let qq in query) {
                // Paging
                if (qq === this.dataMeta.pageSizeKey) {
                    this.dataMeta.pageSize = parseInt(query[qq], 10);
                    this.pageSize = this.dataMeta.pageSize;
                } else if (qq === this.dataMeta.pageNumberKey) {
                    this.dataMeta.currentPage = parseInt(query[qq], 10);
                    this.setCurrentPage();
                } else if (qq === this.orderKey) {
                    // Ordering
                    this.resetOrdering();
                    let orderVal: string;
                    for (let cc in this.columns) {
                        col = this.columns[cc];
                        orderVal = col.orderValue ? col.orderValue : col.dataKey;
                        if (query[qq] === `${this.orderDescendingPrefix}${orderVal}`) {
                            this.columns[cc].orderDirection = 'descending';
                            this.columns[cc].classesHeader.sorted = true;
                            break;
                        } else if (query[qq] === orderVal) {
                            this.columns[cc].orderDirection = 'ascending';
                            this.columns[cc].classesHeader.sorted = true;
                            break;
                        }
                    }
                } else {
                    // Filtering (everything else)
                    let filterDataKey: string;
                    for (let cc in this.columns) {
                        col = this.columns[cc];
                        filterDataKey = col.dataKey;
                        if (qq === filterDataKey) {
                            filtersToSet.push({
                                column: col.dataKey,
                                text: query[qq],
                            });
                            break;
                        }
                    }
                }
            }
            if (filtersToSet.length) {
                this.filters = [];
                this.setAddFilterSelectOpts();
                this.addFilters(filtersToSet);
                this.filtersVisible = true;
            }
            return true;
        }
        return false;
    }

    private setAtLeastOneFilter() {
        // this.atLeastOneFilter = (this.filterText && this.filterColumn) ? true : false;
        this.atLeastOneFilter = this.filters.length ? true : false;
        this.classesClearFilters.hasFilter = this.atLeastOneFilter;
    }

    private clearAllFilters() {
        if (this.atLeastOneFilter) {
            // Leave filter column as is.
            // this.filterText = '';
            this.filters.forEach((filter: any) => {
                if (!filter.noRemove) {
                    this.removeColFilterDefaultVisible(filter.column);
                }
            });
            this.filters = [];
            this.setAddFilterSelectOpts();
            this.onFilter();
        }
    }

    // filterColumnChange() {
    //     this.setCurrentFilterSelectOpts();
    //     this.onFilter();
    // }

    filterKeyup(evt: any) {
        // don't refilter every time the user clicks in or out of the box
        if (evt.evt instanceof FocusEvent) {
            return;
        }
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
        this.resetPaging();
        // this.resetOrdering();
        this.query();
        if (this.filterTimeoutTrigger) {
            clearTimeout(this.filterTimeoutTrigger);
        }
    }

    order(column: any) {
        this.resetPaging();
        // Save before resetting all.
        const orderDirection = column.orderDirection;
        this.resetOrdering();
        if (orderDirection === undefined || orderDirection === 'descending') {
            column.orderDirection = 'ascending';
            column.classesHeader.sorted = true;
        } else {
            column.orderDirection = 'descending';
            column.classesHeader.sorted = true;
        }
        this.query();
    }

    query() {
        this.loading = true;
        let query = {};
        this.currentQueryParams = [];
        query = this.setQueryFilter(query);
        query = this.setQueryOrder(query);
        query = this.setQueryPaging(query);
        if (this.stateName) {
            this.plTable.updateUrl(this.stateName, this.currentQueryParams);
        }
        if (this.queryTimeoutTrigger) {
            clearTimeout(this.queryTimeoutTrigger);
        }
        this.queryTimeoutTrigger = setTimeout(() => {
            this.currentQueryId = this.plLodash.randomString();
            this.onQuery.emit({ query: query, queryId: this.currentQueryId });
        }, this.queryThrottle);
    }

    prevPage() {
        if (this.dataMeta.currentPage > 1) {
            this.dataMeta.currentPage--;
            this.setCurrentPage();
            this.query();
        }
    }

    nextPage() {
        if (this.dataMeta.currentPage < this.dataMeta.totalPages) {
            this.dataMeta.currentPage++;
            this.setCurrentPage();
            this.query();
        }
    }

    changePageKeyup(evt: any) {
        if (evt.keyCode === this.keycodes.enter) {
            this.changePage(evt);
        }
    }

    changePage(evt?: any) {
        if (this.dataMeta.currentPage !== this.currentPage) {
            if (this.dataMeta.currentPage >= 1 && this.dataMeta.currentPage <= this.dataMeta.totalPages) {
                this.setCurrentPage();
                this.query();
            } else {
                this.dataMeta.currentPage = this.currentPage;
            }
        }
    }

    changePageSize() {
        if (this.currentPageSize !== this.dataMeta.pageSize) {
            this.currentPageSize = this.dataMeta.pageSize;
            // Set input as well to avoid this getting overwritten on change.
            this.pageSize = this.dataMeta.pageSize;
            this.resetPaging();
            this.query();
        }
    }

    clickCell(rowIndex: number, colIndex: number) {
        const colData = this.columns[colIndex];
        const rowData = this.data[rowIndex];
        if (colData.click && this.onColumnClick.observers.length) {
            this.onColumnClick.emit({ rowData, colData });
        } else if (this.onRowClick.observers.length) {
            // Currently row will NOT be called if column click handler is.
            this.onRowClick.emit({ rowData, colData });
        }
    }

    onResizeEle(evt: any) {
        this.onResize();
    }

    onResize() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const cards = width < this.cardsWidth ? true : false;
        this.classesCards.table = cards ? false : true;
        this.classesCards.cards = cards ? true : false;
        this.stylesRow.maxWidth = cards ? `${this.cardMaxWidth}px` : 'none';
    }

    onScrollEle(evt: any) {
        this.onScroll();
    }

    onScroll() {
        if (this.fixedHeaderTop >= 0 && this.headerEle && this.headerSpacerEle &&
            this.containerEle) {
            const body = document.body;
            const docEl = document.documentElement;
            const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            const clientTop = docEl.clientTop || body.clientTop || 0;
            const headerSpacerEle = this.headerSpacerEle.nativeElement;
            const headerBox = headerSpacerEle.getBoundingClientRect();
            const headerTop = Math.round(headerBox.top + scrollTop - clientTop);
            const containerEle = this.containerEle.nativeElement;
            const containerBox = containerEle.getBoundingClientRect();
            const containerTop = Math.round(containerBox.top + scrollTop - clientTop);
            const containerBottom = containerTop + containerEle.offsetHeight;
            const headerEle = this.headerEle.nativeElement;
            const headerHeight = headerEle.offsetHeight;
            const headerWidth = headerSpacerEle.offsetWidth;
            const headerOffset = this.fixedHeaderTop;
            if (headerTop - headerOffset < scrollTop && scrollTop < containerBottom - headerOffset - headerHeight) {
                this.stylesHeader.position = 'fixed';
                this.stylesHeader.width = `${headerWidth}px`;
                this.stylesHeader.top = `${this.fixedHeaderTop}px`;
                this.stylesHeaderSpacer.height = `${headerHeight}px`;
                this.classesHeaderRow.fixed = true;
            } else {
                this.stylesHeader.position = 'relative';
                this.stylesHeader.width = 'auto';
                this.stylesHeader.top = 'auto';
                this.stylesHeaderSpacer.height = 0;
                this.classesHeaderRow.fixed = false;
            }
        }
    }
}
