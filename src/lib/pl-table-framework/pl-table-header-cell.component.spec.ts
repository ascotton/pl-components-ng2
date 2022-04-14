import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLTableHeaderCellComponent } from './pl-table-header-cell.component';
import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLLodashService } from '../pl-lodash';

class PLTableFrameworkStub extends PLTableFrameworkService {
}

describe('PLTableHeaderCellComponent', () => {
    let comp: PLTableHeaderCellComponent;
    let fixture: ComponentFixture<PLTableHeaderCellComponent>;
    let plTableFrameworkStub = new PLTableFrameworkStub(new PLLodashService());

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [ PLTableHeaderCellComponent ],
            providers: [
                { provide: PLTableFrameworkService, useValue: plTableFrameworkStub }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLTableHeaderCellComponent);
            comp = fixture.componentInstance;
        })
    }));

    it('ngOnChanges - should initialize the table header cell with changes', () => {
        comp.orderKey = 'ordering';
        const change = {prop: new SimpleChange([], 'ordering', true)};
        comp.ngOnChanges(change);
        expect(comp.orderable).toEqual(true);
    });

    it('updateOrderFromInfo - should update order information with new order direction', () => {
        comp.orderInited = true;
        comp.orderDirection = 'ascending';
        comp.orderKey = 'ordering';
        comp.orderUpdatedInfo = {ordering: 'descending'};
        comp.updateOrderFromInfo();
        expect(comp.orderDirection).toEqual('descending');
    });

    it('updateOrderFromInfo - should not update order information when order has not been inited', () => {
        comp.orderInited = false;
        comp.updateOrderFromInfo();
        expect(comp.orderDirection).toEqual('');
    });

    it('setOrderable - should set orderable to true when order key exists', () => {
        comp.orderKey = 'ordering';
        comp.setOrderable()
        expect(comp.orderable).toEqual(true);
    });

    it('setOrderable - should set orderable to false when there is no order key', () => {
        comp.setOrderable()
        expect(comp.orderable).toEqual(false);
    });

    it('setClasses - should set classes orderable to false and sorted to true', () => {
        comp.orderable = false;
        comp.orderDirection = 'ascending';
        comp.setClasses();
        expect(comp.classes.orderable).toEqual(false);
        expect(comp.classes.sorted).toEqual(true);
    });

    it('setClasses - should set classes orderable to true and sorted to true', () => {
        comp.orderable = true;
        comp.orderDirection = 'descending';
        comp.setClasses();
        expect(comp.classes.orderable).toEqual(true);
        expect(comp.classes.sorted).toEqual(true);
    });

    it('setClasses - should set classes orderable to true and sorted to false', () => {
        comp.orderable = true;
        comp.orderDirection = '';
        comp.setClasses();
        expect(comp.classes.orderable).toEqual(true);
        expect(comp.classes.sorted).toEqual(false);
    });

    it('order - should set ascending cell to descending', () => {
        comp.orderable = true;
        comp.orderKey = 'ordering';
        comp.orderDirection = 'ascending';
        comp.order();
        expect(comp.orderData.orderDirection).toEqual('descending');
    });

    it('order - should set descending cell to ascending', () => {
        comp.orderable = true;
        comp.orderDirection = 'descending';
        comp.order();
        expect(comp.orderData.orderDirection).toEqual('ascending');
    });

    it('order - should set undefined cell to ascending', () => {
        comp.orderable = true;
        comp.orderDirection = undefined;
        comp.order();
        expect(comp.orderData.orderDirection).toEqual('ascending');
    });
});
