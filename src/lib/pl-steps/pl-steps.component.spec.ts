import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLStepsService } from './pl-steps.service';
import { PLStepsComponent } from './pl-steps.component';

class RouterStub {
    events = new Observable(observer => {});
}

class RouteStub {
    routeConfig = {
        children: [
            'child_1'
        ]
    }
}

class LocationStub {
    path() {
        return 'home/place/other';
    }
}

class PLStepsStub extends PLStepsService {}

describe('PLStepsComponent', () => {
    let comp: PLStepsComponent;
    let fixture: ComponentFixture<PLStepsComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            providers: [ 
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useClass: RouteStub },
                { provide: Location, useClass: LocationStub },
                { provide: PLStepsService, useClass: PLStepsStub }
            ],
            declarations: [ PLStepsComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLStepsComponent);
            comp = fixture.componentInstance;
        })
    }));

    it('ngOnChanges - should initiate the steps with changes', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.ngOnChanges({prop: new SimpleChange([], comp.steps, true)});
        expect(comp.currentStepIndex).toEqual(1);
    });

    it('setCurrentStep - should set the current step', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.setCurrentStep();
        expect(comp.currentStepIndex).toEqual(1);
    });

    it('setCurrentStep - should not set current step since the steps list is empty', () => {
        comp.setCurrentStep();
        expect(comp.currentStepIndex).toEqual(0);
    });

    it('formatSteps - should format a steps list', () => {
        comp.steps = [
            { 
                classes: { visited: false },
                disabled: true
            },
            { 
                classes: { visited: true },
                disabled: false
            }
        ];
        const steps2 = [
            { 
                classes: { visited: true },
                disabled: false
            },
            { 
                classes: { visited: false },
                disabled: true
            }
        ];
        comp.formatSteps();
        expect(comp.stepsDisplay).toEqual(steps2);
    });

    it('formatSteps - should format an empty steps list', () => {
        comp.formatSteps();
        expect(comp.stepsDisplay).toEqual([]);
    });

    it('onResizeEle - should resize the classes container when an event occurs', () => {
        comp.verticalWidth = 0;
        comp.onResizeEle({ detail: 'click' });
        expect(comp.classesContainer.horizontal).toEqual(true);
        expect(comp.classesContainer.vertical).toEqual(false);
    });

    it('onResize - should reduce the classes container size when window/doc is reduced', () => {
        comp.verticalWidth = 600;
        comp.onResize(800);
        expect(comp.classesContainer.horizontal).toEqual(true);
        expect(comp.classesContainer.vertical).toEqual(false);
    });

    it('onResize - should reduce the classes container size when window/doc is enlarged', () => {
        comp.verticalWidth = 800;
        comp.onResize(600);
        expect(comp.classesContainer.horizontal).toEqual(false);
        expect(comp.classesContainer.vertical).toEqual(true);
    });
});
