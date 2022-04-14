import { Component, Output, Input, EventEmitter } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';

@Component({
    selector: 'pl-table-footer',
    templateUrl: './pl-table-footer.component.html',
    styleUrls: ['./pl-table-footer.component.less'],
})
export class PLTableFooterComponent {
    @Output() onQuery = new EventEmitter<any>();

    @Input() total: number = 0;
    @Input() totalLabel = 'Total';
    @Input() currentPage: number = 1;
    @Input() currentPageForce: number = 1;
    @Input() currentPageEnableForceUpdates = false;
    @Input() pageSize: number | any = 25;
    @Input() useFixedPageSize = false;
    @Input() pageSizes: number[];
    offset: number = 0;
    @Input() selected: number = 0;
    @Input() stickyFooter = false;

    totalPages: number = 1;
    pageSizeOpts: any[] = [];
    isDebug: boolean = false;
    private pagingIniting: boolean = false;
    private pagingUpdatedInfo: any = {};

    private keycodes: any = {
        enter: 13,
    };

    constructor(
        private plTableFramework: PLTableFrameworkService,
    ) { }

    ngOnInit() {
        // Note: This block was moved from the constructor so it can see Input values
        this.plTableFramework.pagingUpdated$.subscribe((pagingInfo: any) => {
            this.pagingUpdatedInfo = pagingInfo;
            this.pagingIniting = true;
            if (!this.useFixedPageSize && pagingInfo.pageSize !== this.pageSize) {
                this.pageSize = pagingInfo.pageSize;
            }
            if (pagingInfo.currentPage !== this.currentPage) {
                this.currentPage = pagingInfo.currentPage;
            }
            this.setTotal();
        });

        this.isDebug = !!localStorage.getItem('PL_DEBUG_TABLE_FOOTER');
        if (this.isDebug) {
            console.log('🌿 table footer init', { STATE: this });
        }
        this.init();
        this.resetPagingIniting();
    }

    ngOnChanges(changes: any) {
        if (this.isDebug) {
            console.log('🌿 table footer changes', { STATE: this });
        }
        if (this.currentPageEnableForceUpdates) {
            this.currentPage = this.currentPageForce;
            this.pagingUpdatedInfo.currentPage = this.currentPage;
        }
        // Do not allow overriding url paging info if set.
        if (changes.pageSize && this.pagingIniting && this.pagingUpdatedInfo.pageSize) {
            this.pageSize = this.pagingUpdatedInfo.pageSize;
            this.setTotal();
        }
        if (changes.currentPage && this.pagingIniting && this.pagingUpdatedInfo.currentPage) {
            this.currentPage = this.pagingUpdatedInfo.currentPage;
            this.setTotal();
        }
        if (changes.total) {
            this.setTotal();
        }
        this.setDefaults();
        this.setPaging();
    }

    setDefaults() {
        if (!this.pageSize) {
            this.pageSize = this.plTableFramework.pageSize ? this.plTableFramework.pageSize : 25;
        }
        if (!this.total) {
            this.total = 0;
        }
    }

    init() {
        this.setDefaults();
        this.setPaging();
        this.setPageSizeOpts();
    }

    private setPageSizeOpts() {
        const opts: any[] = [];
        let foundCurrentValue: boolean = false;
        const sizes = this.pageSizes || [5, 10, 25, 50, 100];
        for (let ii = 0; ii < sizes.length; ii++) {
            if (!foundCurrentValue && sizes[ii] > parseInt(this.pageSize, 10)) {
                opts.push({ value: this.pageSize, label: this.pageSize });
                foundCurrentValue = true;
            }
            opts.push({ value: sizes[ii], label: sizes[ii] });
            if (sizes[ii] === parseInt(this.pageSize, 10)) {
                foundCurrentValue = true;
            }
        }
        this.pageSizeOpts = opts;
    }

    private setTotal() {
        if (this.total && this.total > this.pageSize) {
            this.totalPages = Math.ceil(this.total / this.pageSize);
            if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        } else {
            this.totalPages = 1;
            this.currentPage = this.plTableFramework.currentPage ? this.plTableFramework.currentPage : 1;
            this.setOffset();
        }
    }

    private setPaging() {
        // If set already (from url), do not want to override.
        if (!this.pagingIniting) {
            this.setTotal();
            this.updatePaging();
        }
    }

    private setOffset() {
        this.pageSize = this.plTableFramework.pageSize ? this.plTableFramework.pageSize : this.pageSize;
        this.offset = (this.currentPage - 1) * this.pageSize;
    }

    private resetPagingIniting() {
        this.pagingIniting = false;
    }

    prevPage() {
        this.resetPagingIniting();
        if (this.currentPage > 1) {
            this.currentPage--;
            this.setOffset();
            this.query();
        }
    }

    nextPage() {
        this.resetPagingIniting();
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.setOffset();
            this.query();
        }
    }

    changePageKeyup(evt: any) {
        if (evt.keyCode === this.keycodes.enter) {
            this.changePage(evt);
        }
    }

    changePage(evt: any) {
        this.resetPagingIniting();
        if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {
            this.setPaging();
            this.setOffset();
            this.query();
        } else {
            if (this.currentPage < 1) {
                this.currentPage = 1;
            } else if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            }
            this.setOffset();
        }
    }

    changePageSize() {
        this.resetPagingIniting();
        this.setPaging();
        this.query();
    }

    private updatePaging() {
        this.plTableFramework.updatePaging(this.pageSize, this.currentPage);
    }

    private query() {
        const data = {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            offset: this.offset,
        };
        this.updatePaging();
        const query = this.plTableFramework.formQuery();
        const queryInfo = { data: data, query: query };
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }
}