import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PLInputModule } from './index';

import { PLInputSelectComponent } from './pl-input-select.component';
import { PLInputSharedService } from './pl-input-shared.service';

describe('PLInputSelectComponent', () => {
    let component: PLInputSelectComponent;
    let fixture: ComponentFixture<PLInputSelectComponent>;
    let componentContainer: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PLInputModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLInputSelectComponent);

        component = fixture.debugElement.componentInstance;
        componentContainer = fixture.debugElement.query(By.css('.pl-input-select'));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onChanges', () => {
        it('should clear the \'filterModel\' when \'clearSelectFilter\' is true', () => {
            component.filterModel = 'some random text to be cleared'
            component.clearSelectFilter = true;
            component.ngOnChanges({});

            expect(component.filterModel).toEqual('');
        });
    });

    describe('focusout', () => {
        const formControl = new FormControl('');
        let inputService: any;

        beforeEach(() => {
            spyOn(formControl, 'markAsTouched').and.stub();

            component.formControl = formControl;

            inputService = fixture.debugElement.injector.get(PLInputSharedService);
        });

        describe('when the focus is outside the component', () => {
            beforeEach(() => {
                spyOn(inputService, 'containsFocus').and.returnValue(false);
            });

            xit('sets the form control as touched', fakeAsync(() => {
                componentContainer.triggerEventHandler('focusout', null);

                tick();

                expect(formControl.markAsTouched).toHaveBeenCalled();
            }));
        });

        describe('when the focus is contained within the component', () => {
            beforeEach(() => {
                spyOn(inputService, 'containsFocus').and.returnValue(true);
            });

            it('does not set the form control as touched', fakeAsync(() => {
                componentContainer.triggerEventHandler('focusout', null);

                tick();

                expect(formControl.markAsTouched).not.toHaveBeenCalled();
            }));
        });
    });

    describe('selectOption', () => {
        beforeEach(() => {
            component.options = [ { label: 'Cooper' }];
            component.focused = true;

            fixture.detectChanges();
        });

        it('should mark form control as touched', () => {
            const formControl = new FormControl('');

            spyOn(formControl, 'markAsTouched').and.stub();

            component.formControl = formControl;

            const option = fixture.debugElement.query(By.css('.options > div:first-child'));

            option.triggerEventHandler('click', {});

            expect(formControl.markAsTouched).toHaveBeenCalled();
        });
    });
});
