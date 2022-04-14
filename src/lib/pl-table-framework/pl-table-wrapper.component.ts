import { Component, Output, EventEmitter } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFrameworkUrlService } from './pl-table-framework-url.service';
import { PLTableFiltersService } from './pl-table-filters.service';

@Component({
    selector: 'pl-table-wrapper',
    templateUrl: './pl-table-wrapper.component.html',
    styleUrls: ['./pl-table-wrapper.component.less'],
    inputs: [
        'orderDescendingPrefix',
        'orderKey',
        'orderDelimiter',
        'pageSizeKey',
        'pageNumberKey',
        'offsetKey',
        'stateName',
    ],
    providers: [PLTableFrameworkService, PLTableFrameworkUrlService, PLTableFiltersService],
})
export class PLTableWrapperComponent {
    @Output() onQuery = new EventEmitter<any>();

    orderDescendingPrefix: string;
    orderKey: string;
    orderDelimiter: string;
    pageSizeKey: string;
    pageNumberKey: string;
    offsetKey: string;
    stateName: string = '';

    constructor(
        private plTableFramework: PLTableFrameworkService,
        private plTableFrameworkUrl: PLTableFrameworkUrlService
    ) {
        plTableFramework.queryUpdated$.subscribe(info => {
            if (this.stateName) {
                this.plTableFrameworkUrl.updateUrl(this.stateName, info.queryParams);
            }
            this.onQuery.emit(info);
        });
    }

    ngOnInit() {
        this.plTableFramework.setOrderKeys({
            orderDescendingPrefix: this.orderDescendingPrefix,
            orderKey: this.orderKey,
            orderDelimiter: this.orderDelimiter,
        });
        this.plTableFramework.setPagingKeys({
            pageSizeKey: this.pageSizeKey,
            pageNumberKey: this.pageNumberKey,
            offsetKey: this.offsetKey,
        });
        this.updateFromUrl();
    }

    ngOnChanges(changes: any) {
        this.updateFromUrl();
    }

    updateFromUrl() {
        if (this.stateName) {
            this.plTableFrameworkUrl.getStateFromUrl(this.stateName).subscribe((res: any) => {
                this.plTableFramework.updateQueryFromParams(res.query);
            });
        }
    }
}
