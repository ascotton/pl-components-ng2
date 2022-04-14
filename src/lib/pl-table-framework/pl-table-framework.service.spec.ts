import { TestBed, async } from '@angular/core/testing';

import { PLLodashService } from '../pl-lodash';
import { PLTableFrameworkService } from './pl-table-framework.service';

describe('PLTableFrameworkService', () => {
    let service: PLTableFrameworkService;

    beforeEach(() => {
        service = new PLTableFrameworkService(new PLLodashService());
    });

    it('updateQueryFromParams - should update the page size and ordering of the table framework', () => {
        const query = {
            limit: 25,
            ordering: '-first,-last',
        };
        service.updateQueryFromParams(query);
        expect(service.pageSize).toEqual(25);
        expect(service.orderDirection).toEqual(
            {
                first: 'descending',
                last: 'descending',
            },
        );
    });

    it('updateQueryFromParams - should update the current page and ordering of the table framework', () => {
        const query = {
            page: 3,
            ordering: 'first,last',
        };
        service.updateQueryFromParams(query);
        expect(service.currentPage).toEqual(3);
        expect(service.orderDirection).toEqual(
            {
                first: 'ascending',
                last: 'ascending',
            },
        );
    });

    it('getQueryParams - should return the paramaters of the query', () => {
        const query = {
            limit: 25,
        };
        const queryParams = [
            {
                key: 'limit',
                value: 25,
                type: 'pageSize',
            },
        ];
        expect(service.getQueryParams(query)).toEqual(queryParams);
    });

    it('getQueryParams - should return a filter parameter list as the default', () => {
        const query = {
            someFilter: 25,
        };
        const queryParams = [
            {
                key: 'someFilter',
                value: 25,
                type: 'filter',
            },
        ];
        expect(service.getQueryParams(query)).toEqual(queryParams);
    });

    it('getTypeFromKey - should get the type from the given key', () => {
        expect(service.getTypeFromKey('page')).toEqual('pageNumber');
    });

    it('getTypeFromKey - should return an empty string when given the offset key', () => {
        expect(service.getTypeFromKey('offset')).toEqual('');
    });

    it('getTypeFromKey - should return a filter type by default', () => {
        expect(service.getTypeFromKey('someFilter')).toEqual('filter');
    });

    it('getData - should return table data', () => {
        expect(service.getData()).toEqual({
            currentPage: service.currentPage,
            pageSize: service.pageSize,
            offset: service.offset,
            orderDirection: service.orderDirection,
        });
    });

    it('addOrderDirection - should add an ordering direction to the ordering direction list', () => {
        service.addOrderDirection('first', 'descending');
        expect(service.orderDirection['first']).toEqual('descending');
        expect(service.inited.order).toEqual(true);
    });

    it('setOrderKeys - should set the value of the ordering keys', () => {
        const keys = {
            orderDescendingPrefix: '_',
            orderKey: 'ordering2',
            orderDelimiter: '.',
        };
        service.setOrderKeys(keys);
        expect(service.orderDescendingPrefix).toEqual('_');
        expect(service.orderKey).toEqual('ordering2');
        expect(service.orderDelimiter).toEqual('.');
    });

    it('setOrderKeys - should not change ordering keys when given undefined keys', () => {
        const keys: any = {};
        service.setOrderKeys(keys);
        expect(service.orderDescendingPrefix).toEqual('-');
        expect(service.orderKey).toEqual('ordering');
        expect(service.orderDelimiter).toEqual(',');
    });

    it('setPagingKeys - should set the paging keys', () => {
        const keys = {
            pageSizeKey: 'limit2',
            offsetKey: 'offset',
        };
        service.setPagingKeys(keys);
        expect(service.pageSizeKey).toEqual('limit2');
        expect(service.pageNumberKey).toEqual('page');
        expect(service.offsetKey).toEqual('offset');
    });

    it('getOrderValueInfo - should get info of the given descending order', () => {
        const orderInfo = {
            direction: 'descending',
            value: 'first',
        };
        expect(service.getOrderValueInfo('-first')).toEqual(orderInfo);
    });

    it('getOrderValueInfo - should get info of the given ascending order', () => {
        const orderInfo = {
            direction: 'ascending',
            value: 'first',
        };
        expect(service.getOrderValueInfo('first')).toEqual(orderInfo);
    });

    it('resetOrder - should reset an empty order direction list to empty', () => {
        service.resetOrder();
        expect(service.orderDirection).toEqual({});
    });

    it('resetOrder - should reset a filled order direction list to empty', () => {
        service.orderDirection = {
            first: 'ascending',
            last: '',
        };
        const newOrderDirection = {
            first: '',
            last: '',
        };
        service.resetOrder();
        expect(service.orderDirection).toEqual(newOrderDirection);
    });

    it('formOrderQuery - should return a descending order query', () => {
        const dataInfo = {
            orderDirection: 'descending',
            orderKey: 'order',
        };
        expect(service.formOrderQuery(dataInfo)).toEqual('-order');
    });

    it('formOrderQuery - should return an ascending order query', () => {
        const dataInfo = {
            orderDirection: 'ascending',
            orderKey: 'order',
        };
        expect(service.formOrderQuery(dataInfo)).toEqual('order');
    });

    it('formOrderQuery - should reset the ordering direction list', () => {
        service.orderDirection = {
            first: 'ascending',
            last: '',
        };
        const dataInfo = {
            orderDirection: 'ascending',
            orderKey: 'order',
        };
        service.formOrderQuery(dataInfo);
        expect(service.orderDirection).toEqual({
            first: '',
            last: '',
        });
    });

    it('setOrderQuery - should set ordering', () => {
        const orderQuery = {
            orderDirection: 'ascending',
            orderKey: 'ordering',
        };
        const setOrderQuery = {
            orderDirection: 'ascending',
            orderKey: 'ordering',
        };
        expect(service.setOrderQuery(orderQuery)).toEqual(setOrderQuery);
    });

    it('setOrderQuery - should set ascending order', () => {
        service.orderDirection = {
            first: 'ascending',
            last: '',
        };
        const orderQuery = {
            orderDirection: 'ascending',
            orderKey: 'ordering',
        };
        const setOrderQuery = {
            orderDirection: 'ascending',
            orderKey: 'ordering',
            ordering: 'first',
        };
        expect(service.setOrderQuery(orderQuery)).toEqual(setOrderQuery);
    });

    it('setOrderQuery - should set descending order', () => {
        service.orderDirection = {
            first: 'descending',
            last: '',
        };
        const orderQuery = {
            orderDirection: 'descending',
            orderKey: 'ordering',
        };
        const setOrderQuery = {
            orderDirection: 'descending',
            orderKey: 'ordering',
            ordering: '-first',
        };
        expect(service.setOrderQuery(orderQuery)).toEqual(setOrderQuery);
    });

    it('formAndUpdateOrderQuery - should form and update an order query', () => {
        const dataInfo = {
            orderDirection: 'ascending',
            orderKey: 'ordering',
        };
        expect(service.formAndUpdateOrderQuery(dataInfo)).toEqual('ordering');
    });

    it('updateOrderDirection - should update ordering direction', () => {
        service.orderDirection = {
            first: 'descending',
            last: '',
        };
        service.updateOrderDirection();
        expect(service.orderDirection).toEqual({
            first: 'descending',
            last: '',
        });
    });

    it('updatePaging - should update the paging', () => {
        service.updatePaging(50, 3);
        expect(service.pageSize).toEqual(50);
        expect(service.currentPage).toEqual(3);
        expect(service.offset).toEqual(100);
        expect(service.inited.paging).toEqual(true);
    });

    it('updatePaging - should update the paging', () => {
        service.updatePaging(0, 1);
        expect(service.pageSize).toEqual(0);
        expect(service.currentPage).toEqual(1);
        expect(service.offset).toEqual(0);
        expect(service.inited.paging).toEqual(true);
    });

    it('updateFilters - should update the filters list', () => {
        const filters = [{ value: 'a', text: 'a_text' }, { value: 'b', text: 'b_text' }];
        const filterValues = [{ value: 'a', text: 'a_text' }, { value: 'b', text: 'b_text' }];
        service.updateFilters(filters);
        expect(service.filterValues).toEqual(filterValues);
    });

    it('setFilterQuery - should set the filters', () => {
        const filters = [{ value: 'a', text: 'a_text' }];
        service.updateFilters(filters);
        let query = service.formQuery();
        query = service.setFilterQuery(query);
        expect(query.a).toEqual('a_text');
    });

    it('formQuery - should return a query', () => {
        const query = service.formQuery();
        expect(query.limit).toEqual(service.pageSize);
        expect(query.offset).toEqual(service.offset);
        expect(query.page).toEqual(service.currentPage);
    });

    it('initialLoadQuery - should load the query', () => {
        service.inited = {
            order: true,
            paging: true,
            firstLoad: false,
        };
        service.initialLoadQuery();
        expect(service.inited.firstLoad).toEqual(true);
    });

    it('initialLoadQuery - should not load the query since already been loaded', () => {
        service.inited = {
            order: true,
            paging: true,
            firstLoad: true,
        };
        service.initialLoadQuery();
        expect(service.inited.firstLoad).toEqual(true);
    });
});
