import { Injectable } from '@angular/core';

// A minimal service for paginating a sorting a local data array for display in a table

@Injectable()
export class PLTableLocalDataService {
    dataRows: any[] = [];
    displayRows: any[] = [];

    currentPage: number = 1;
    pageSize: number = 5;
    orderDescendingPrefix: string = '-';
    private total: number;
    private sortOption: string = '';

    updateDisplayRows() {
        const start = this.pageSize * (this.currentPage - 1);
        if (this.sortOption) {
            let sortField: string;
            let sortDirection: number = 0;
            if (this.sortOption.indexOf(this.orderDescendingPrefix) === 0) {
                sortField = this.sortOption.substring(1);
                sortDirection = 1;
            } else {
                sortField = this.sortOption;
                sortDirection = -1;
            }
            this.dataRows.sort((a: any, b: any) => {
                if (a[sortField] < b[sortField]) {
                    return -1 * sortDirection;
                }
                if (b[sortField] < a[sortField]) {
                    return sortDirection;
                }
                return 0;
            });
        }
        this.displayRows = this.dataRows.slice(start, start + this.pageSize);
    }

    onQuery(info: any) {
        if (info.data.pageSize) {
            this.pageSize = info.data.pageSize;
        }
        if (info.data.currentPage) {
            this.currentPage = info.data.currentPage;
        }
        this.sortOption = info.orderQuery;
        this.updateDisplayRows();
    }
}
