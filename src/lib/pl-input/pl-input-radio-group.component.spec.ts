import { Component } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PLInputModule } from './index';
import { PLInputRadioGroupComponent } from './pl-input-radio-group.component';

describe('PLInputRadioGroupComponent', () => {
    @Component({
        selector: 'host-component',
        template: `<pl-input-radio-group [options]="options"></pl-input-radio-group>`,
    })
    class HostComponent {
        options: any[] = [];
    }

    let hostComponent: HostComponent;
    let component: PLInputRadioGroupComponent;
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PLInputModule],
            declarations: [HostComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HostComponent);

        hostComponent = fixture.debugElement.componentInstance;
        component = fixture.debugElement.query(By.css('pl-input-radio-group')).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('touched state', () => {
        it('should mark form control as touched on radio change', fakeAsync(() => {
            hostComponent.options = [ { value: 'agent', label: 'Agent' } ];

            fixture.detectChanges();

            const formControl = new FormControl('');

            spyOn(formControl, 'markAsTouched').and.stub();

            component.formControl = formControl;

            const button = fixture.debugElement.query(By.css('pl-input-radio'));

            button.triggerEventHandler('change', {});

            tick();

            expect(formControl.markAsTouched).toHaveBeenCalled();
        }));
    });
});
