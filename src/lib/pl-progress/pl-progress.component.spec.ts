import {
  DebugElement,
} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
    async
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { PLProgressComponent } from './pl-progress.component';
import { PLProgressModule } from './';

describe('PLProgressComponent', () => {
    let component: PLProgressComponent;
    let fixture: ComponentFixture<PLProgressComponent>;
    let progressElement: DebugElement;

    const getProgressElement = () => fixture.debugElement.query(By.css('progress'));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ PLProgressModule ],
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(PLProgressComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();

            progressElement = getProgressElement();
        });
    }));

    it('creates', () => {
        expect(component).toBeTruthy();
    });

    describe('indeterminate state', () => {
        xit('is true by default', () => {
            expect(progressElement.properties.value).not.toBeDefined();
        });

        xit('is true when value set to null', () => {
            component.value = null;

            fixture.detectChanges();

            progressElement = getProgressElement();

            expect(progressElement.properties.value).not.toBeDefined();
        });
    });

    describe('determinate state', () => {
        it('is determinate when value is set', () => {
            component.value = .5;

            fixture.detectChanges();

            progressElement = getProgressElement();

            expect(progressElement.properties.value).toBe(.5);
        });
    });

    describe('meter', () => {
        let meterElement: DebugElement;

        beforeEach(() => {
            meterElement = fixture.debugElement.query(By.css('.meter'));
        });

        it('is adjusted by value', () => {
            component.value = .5;

            fixture.detectChanges();

            expect(meterElement.styles.width).toBe('50%');
        });

        it('should be 0% when value is 0', () => {
            component.value = 0;

            fixture.detectChanges();

            expect(meterElement.styles.width).toBe('0%');
        });

        it('should be 100% when value is 1', () => {
            component.value = 1;

            fixture.detectChanges();

            expect(meterElement.styles.width).toBe('100%');
        });
    });
});
