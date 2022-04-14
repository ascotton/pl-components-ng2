import {
    Component,
    DebugElement,
} from '@angular/core';

import { By } from '@angular/platform-browser';

import {
    async,
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { PLDialogModule } from './';

import { PLAnchoredDialogComponent } from './pl-anchored-dialog.component';

describe('PLAnchoredDialogComponent', () => {
    let component: PLAnchoredDialogComponent;
    let fixture: ComponentFixture<PLAnchoredDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PLDialogModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLAnchoredDialogComponent);

        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('close button', () => {
        let closeButton: DebugElement;

        beforeEach(() => {
            closeButton = fixture.debugElement.query(By.css('.close-button'));
        });

        it('is a button element', () => {
            expect(closeButton.nativeNode.nodeName).toEqual('BUTTON');
        });

        it('emits closeAttempt event on click', fakeAsync(() => {
            const onCloseAttempt = jasmine.createSpy('onCloseAttempt');

            component.closeAttempt.subscribe(onCloseAttempt);

            closeButton.triggerEventHandler('click', null);

            tick();

            expect(onCloseAttempt).toHaveBeenCalled();
        }));
    });

    describe('expand/collapse button', () => {
        let button: DebugElement;
        let itemsContainer: DebugElement;

        beforeEach(() => {
            button = fixture.debugElement.query(By.css('.expand-collapse-button'));
            itemsContainer = fixture.debugElement.query(By.css('.body'));
        });

        it('is a button element', () => {
            expect(button.nativeNode.nodeName).toEqual('BUTTON');
        });

        it('hides dialog content when clicked', () => {
            button.triggerEventHandler('click', null);

            fixture.detectChanges();

            expect(itemsContainer.nativeElement.hidden).toBeTruthy();
        });

        it('shows dialog content when clicked a second time', () => {
            button.triggerEventHandler('click', null);
            button.triggerEventHandler('click', null);

            fixture.detectChanges();

            expect(itemsContainer.nativeElement.hidden).toBeFalsy();
        });
    });

    describe('title', () => {
        it('is in header', () => {
            component.title = 'My Dialog';

            fixture.detectChanges();

            const header = fixture.debugElement.query(By.css('.header'));

            expect(header.nativeElement.textContent).toContain('My Dialog');
        });
    });
});
