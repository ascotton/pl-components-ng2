import { Component } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PLInputModule } from './index';
import { PLInputCheckboxGroupComponent } from './pl-input-checkbox-group.component';

describe('PLInputCheckboxGroupComponent', () => {
    @Component({
        selector: 'host-component',
        template: `<pl-input-checkbox-group [options]="options"></pl-input-checkbox-group>`,
    })
    class HostComponent {
        options: any[] = [];
    }

    let hostComponent: HostComponent;
    let component: PLInputCheckboxGroupComponent;
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
        component = fixture.debugElement.query(By.css('pl-input-checkbox-group')).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('touched state', () => {
        it('should mark form control as touched on checkbox change', fakeAsync(() => {
            hostComponent.options = [ { value: 'agent', label: 'Agent' } ];

            fixture.detectChanges();

            const formControl = new FormControl('');

            spyOn(formControl, 'markAsTouched').and.stub();

            component.formControl = formControl;

            const checkbox = fixture.debugElement.query(By.css('pl-input-checkbox'));

            checkbox.triggerEventHandler('change', {});

            tick();

            expect(formControl.markAsTouched).toHaveBeenCalled();
        }));
    });
});
