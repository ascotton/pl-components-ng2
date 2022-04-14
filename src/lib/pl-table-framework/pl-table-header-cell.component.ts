import { Component, Output, EventEmitter } from '@angular/core';

import { PLTableFrameworkService } from './pl-table-framework.service';

@Component({
    selector: 'pl-table-header-cell',
    templateUrl: './pl-table-header-cell.component.html',
    styleUrls: ['./pl-table-header-cell.component.less'],
    inputs: ['orderKey', 'orderDirection'],
})
export class PLTableHeaderCellComponent {
    @Output() onQuery = new EventEmitter<any>();

    orderKey: string = '';
    orderDirection: string = '';

    orderable: boolean = false;
    classes: any = {
        orderable: false,
        sorted: false,
    };
    orderInited: boolean = false;
    orderUpdatedInfo: any = {};
    orderData = {
        orderKey: '',
        orderDirection: ''
    };

    constructor(private plTableFramework: PLTableFrameworkService) {
        plTableFramework.orderDirectionUpdated$.subscribe((orderDirectionMap: any) => {
            this.orderUpdatedInfo = orderDirectionMap;
            this.orderInited = true;
            this.updateOrderFromInfo();
        });
    }

    ngOnInit() {
        this.plTableFramework.addOrderDirection(this.orderKey, this.orderDirection);
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();
    }

    init() {
        this.setOrderable();
        this.setClasses();
        this.updateOrderFromInfo();
    }

    updateOrderFromInfo() {
        if (this.orderInited) {
            const newOrderDirection = this.orderUpdatedInfo[this.orderKey];
            if (this.orderDirection !== newOrderDirection) {
                this.orderDirection = newOrderDirection;
                this.setClasses();
            }
        }
    }

    setOrderable() {
        this.orderable = this.orderKey ? true : false;
    }

    setClasses() {
        this.classes.orderable = this.orderable;
        this.classes.sorted =
            this.orderDirection === 'ascending' || this.orderDirection === 'descending' ? true : false;
    }

    order() {
        this.orderInited = false;
        if (this.orderable) {
            if (this.orderDirection === '' || this.orderDirection === undefined || this.orderDirection === 'descending') {
                this.orderDirection = 'ascending';
            } else {
                this.orderDirection = 'descending';
            }
            this.setClasses();
            this.query();
        }
    }

    query() {
        this.orderData = {
            orderKey: this.orderKey,
            orderDirection: this.orderDirection,
        };
        const orderQuery = this.plTableFramework.formAndUpdateOrderQuery(this.orderData);
        const query = this.plTableFramework.formQuery();
        const queryInfo = { data: this.orderData, orderQuery: orderQuery, query: query };
        if (this.onQuery.observers.length) {
            this.onQuery.emit(queryInfo);
        }
        this.plTableFramework.updateQuery(queryInfo);
    }
}
