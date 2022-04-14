import { Component, Output, EventEmitter } from '@angular/core';

import { PLFormatterService } from '../pl-formatter';
import { PLLodashService } from '../pl-lodash';

import { PLTableFrameworkService } from './pl-table-framework.service';

interface Order {
    value: string;
    label: string;
    key: string;
    direction: string;
}

@Component({
    selector: 'pl-table-order-top',
    templateUrl: './pl-table-order-top.component.html',
    styleUrls: ['./pl-table-order-top.component.less'],
    inputs: ['orderValue', 'orderOptions', 'orderDescendingPrefix', 'total', 'title'],
})
export class PLTableOrderTopComponent {
    @Output() onQuery = new EventEmitter<any>();

    orderValue: string = '';
    orderOptions: Order[] = [];
    orderDescendingPrefix: string = '-';
    total: number = 0;
    title: string = '';

    orderValueCopy: string = '';
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
        this.init();
    }

    ngOnChanges(changes: any) {
        // Revert orderValue if has already been set (by url).
        if (this.orderInited && changes.orderValue) {
            this.orderValue = this.orderValueCopy;
            this.orderInited = false;
        }
        this.init();
    }

    init() {
        this.addOrderDirections();
        this.updateOrderFromInfo();
    }

    addOrderDirections() {
        let ordersToAdd = {};
        this.orderOptions.forEach((order: Order) => {
            // We only want to set the key ONCE (not twice for ascending and descending).
            // But we need to also set the default, so need to check both to see if a
            // direction is set.
            let defaultDirection = (order.value === this.orderValue) ? order.direction : '';
            if (!ordersToAdd[order.key]) {
                ordersToAdd[order.key] = {
                    key: order.key,
                    direction: defaultDirection,
                };
            } else if (defaultDirection && !ordersToAdd[order.key].direction) {
                ordersToAdd[order.key].direction = defaultDirection;
            }
            
        });
        for (let key in ordersToAdd) {
            this.plTableFramework.addOrderDirection(ordersToAdd[key].key, ordersToAdd[key].direction);
        }
    }

    updateOrderFromInfo() {
        if (this.orderInited) {
            for (let key in this.orderUpdatedInfo) {
                if (this.orderUpdatedInfo[key]) {
                    this.orderValue = this.addPrefix(key, this.orderUpdatedInfo[key]);
                    // Save so default does not overwrite it.
                    this.orderValueCopy = this.orderValue;
                }
            }
        }
    }

    order(evt: any) {
        this.orderInited = false;
        this.query();
    }

    addPrefix(key: string, direction: string) {
        return (direction === 'descending') ? `${this.orderDescendingPrefix}${key}` : key;
    }

    stripPrefix(key: string) {
        return (key[0] === this.orderDescendingPrefix) ? key.slice(1, key.length) : key;
    }

    query() {
        // Get order direction.
        let orderDirection = 'ascending';
        this.orderOptions.forEach((order: Order) => {
            if (order.value === this.orderValue) {
                orderDirection = order.direction;
            }
        });
        this.orderData = {
            orderKey: this.stripPrefix(this.orderValue),
            orderDirection: orderDirection,
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
