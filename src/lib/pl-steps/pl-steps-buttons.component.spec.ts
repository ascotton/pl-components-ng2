import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLLinkService } from '../pl-link/pl-link.service';

import { PLStepsService } from './pl-steps.service';
import { PLStepsButtonsComponent } from './pl-steps-buttons.component';

class RouterStub {
    navigated: boolean = false;
    events = new Observable(observer => {});
    navigate(commands: any[], extras: NavigationExtras) {
        this.navigated = true;
    }
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

class PLLinkStub {
    navigated: boolean = false;
    navigate(href: string, queryParams: any) { 
        this.navigated = true;
    }
}

describe('PLStepsButtonsComponent', () => {
    let comp: PLStepsButtonsComponent;
    let fixture: ComponentFixture<PLStepsButtonsComponent>;
    let router: any;
    let plLink: any;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            providers: [ 
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useClass: RouteStub },
                { provide: Location, useClass: LocationStub },
                { provide: PLStepsService, useClass: PLStepsStub },
                { provide: PLLinkService, useClass: PLLinkStub }
            ],
            declarations: [ PLStepsButtonsComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLStepsButtonsComponent);
            comp = fixture.componentInstance;
            router = fixture.debugElement.injector.get(Router);
            plLink = fixture.debugElement.injector.get(PLLinkService);
        })
    }));

    it('setCurrentStep - should set the current step object when steps list exists', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        const currentStep = {
            prevDisabled: false,
            nextDisabled: false,
            href: '/other/step-2'
        }
        comp.setCurrentStep();
        expect(comp.currentStep).toEqual(currentStep);
    });

    it("setCurrentStep - should not set the current step object when steps list is empty/doesn't exist", () => {
        comp.setCurrentStep();
        expect(comp.currentStep).toEqual({});
    });

    it('onLastStep - should return true when on last step', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.currentStepIndex = 1;
        expect(comp.onLastStep()).toEqual(true);
    });

    it('onLastStep - should return false when not on last step', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.currentStepIndex = 0;
        expect(comp.onLastStep()).toEqual(false);
    });

    it('setNextText - should set the next text to finish text when on last step', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.currentStepIndex = 1;
        comp.setNextText();
        expect(comp.currentNextText).toEqual('Finish');
    });

    it('setNextText - should set to next text to next text', () => {
        comp.steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        comp.currentStepIndex = 0;
        comp.setNextText();
        expect(comp.currentNextText).toEqual('Next');
    });

    it('prevStep - should navigate to previous step and replace history', () => {
        comp.steps = [
            { 
                href: '/other/step-1',
                replaceHistory: true
            },
            { 
                href: '/other/step-2',
                replaceHistory: true
            }
        ];
        comp.currentStepIndex = 1;
        comp.prevStep();
        expect(plLink.navigated).toEqual(true);
    });

    it('prevStep - should navigate to previous step and not replace history', () => {
        comp.steps = [
            { 
                href: '/other/step-1',
                replaceHistory: false
            },
            { 
                href: '/other/step-2',
                replaceHistory: false
            }
        ];
        comp.currentStepIndex = 1;
        comp.prevStep();
        expect(router.navigated).toEqual(true);
    });

    it('nextStep - should navigate to next step and replace history', () => {
        comp.steps = [
            { 
                href: '/other/step-1',
                replaceHistory: true
            },
            { 
                href: '/other/step-2',
                replaceHistory: true
            }
        ];
        comp.currentStepIndex = 0;
        comp.nextStep();
        expect(plLink.navigated).toEqual(true);
    });

    it('nextStep - should navigate to next step and not replace history', () => {
        comp.steps = [
            { 
                href: '/other/step-1',
                replaceHistory: false
            },
            { 
                href: '/other/step-2',
                replaceHistory: false
            }
        ];
        comp.currentStepIndex = 0;
        comp.nextStep();
        expect(router.navigated).toEqual(true);
    });
});
