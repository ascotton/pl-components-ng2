import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLClientStudentDisplayComponent } from './pl-client-student-display.component';

describe('PLClientStudentDisplayComponent', () => {
    let comp: PLClientStudentDisplayComponent;
    let fixture: ComponentFixture<PLClientStudentDisplayComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [ PLClientStudentDisplayComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLClientStudentDisplayComponent);
            comp = fixture.componentInstance;
        })
    }));

    it('displayText - get text', () => {
        comp.user = {};
        expect(comp.displayText).toEqual('client');

        comp.user = {
            xEnabledUiFlags: ['display-client-as-student'],
        };
        comp.uppercase = true;
        expect(comp.displayText).toEqual('STUDENT');
    });
});
