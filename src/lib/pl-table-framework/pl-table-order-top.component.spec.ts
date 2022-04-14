import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLTableOrderTopComponent } from './pl-table-order-top.component';
import { PLTableFrameworkService } from './pl-table-framework.service';
import { CommifyPipe } from '../pipes/commify.pipe';
import { PLLodashService } from '../pl-lodash';

class PLTableFrameworkStub extends PLTableFrameworkService {
}

describe('PLTableOrderTopComponent', () => {
    let comp: PLTableOrderTopComponent;
    let fixture: ComponentFixture<PLTableOrderTopComponent>;
    let plTableFrameworkStub = new PLTableFrameworkStub(new PLLodashService());

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [ PLTableOrderTopComponent, CommifyPipe ],
            providers: [
                { provide: PLTableFrameworkService, useValue: plTableFrameworkStub }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLTableOrderTopComponent);
            comp = fixture.componentInstance;
        })
    }));

    describe('ngOnChanges', () => {
        it('should initialize with changes', () => {
            comp.orderValue = 'ordering';
            comp.orderOptions = [
                { value: 'first', label: 'First (A-Z)', key: 'first', direction: 'ascending' },
                { value: 'first', label: 'First (Z-A)', key: '-first', direction: 'descending' },
            ];
            const change = {prop: new SimpleChange([], 'ordering', true)};
            comp.ngOnChanges(change);
            // expect(comp.orderable).toEqual(true);
        });
    });
});
