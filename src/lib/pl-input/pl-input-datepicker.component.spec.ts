// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { ComponentFixture, TestBed, async } from '@angular/core/testing';

// import moment from 'moment';

// import { PLInputDropdownService } from './pl-input-dropdown.service';
// import { PLInputSharedService } from './pl-input-shared.service';
// import { PLInputErrorsService } from './pl-input-errors.service';
// import { PLInputDatepickerComponent } from './pl-input-datepicker.component';

// export class PLInputDropdownStub extends PLInputDropdownService{}

// export class PLInputErrorStub extends PLInputErrorsService{
//     constructor() {
//         super(null);
//     }
// }

// // export class PLInputSharedStub extends PLInputSharedService{
// //     constructor() {
// //         super(null);
// //     }
// // }

// describe('PLInputDatepickerComponent', () => {
//     let comp: PLInputDatepickerComponent;
//     let fixture: ComponentFixture<PLInputDatepickerComponent>;
//     let plInputSharedStub: PLInputSharedService = new PLInputSharedService(new PLInputErrorStub());

//     beforeEach( async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ PLInputDatepickerComponent ],
//             providers: [ 
//                 { provide: PLInputDropdownService, useClass: PLInputDropdownStub },
//                 { provide: PLInputErrorsService, useClass: PLInputErrorStub },
//                 //{ provide: PLInputSharedService, useClass: PLInputSharedStub },
//                 { provide: PLInputSharedService, useValue: plInputSharedStub },
//             ],
//             schemas: [ NO_ERRORS_SCHEMA ]
//         })
//         .compileComponents();
//     }));   
        
//     beforeEach(() => {
//         fixture = TestBed.createComponent(PLInputDatepickerComponent);
//         comp = fixture.componentInstance;

//         comp.model = 'client.birthdate';
//         comp.label = 'label';
//         comp.placeholder = 'MMM D, YYYY';
//         comp.disabled = false;
//         comp.required = false;
//         comp.validationMessages = {};
//         comp.formCtrl = new FormGroup({});
//         comp.formatDisplay = 'MMM D, YYYY';
//         comp.format = 'YYYY-MM-DD';
//         comp.firstDayOfWeek = 0;
//         comp.minDate = '2017-02-01';
//         comp.maxDate = '2019-02-01';
//         comp.selectedRange = 'day';
//         comp.todayRange = 'month';
//         comp.monthOptsFormat = 'MMM';
//         comp.dropdownContainerSelector = 'body';
//         comp.name = 'ctrl';
//         fixture.detectChanges();
//     });

//     it('getValidations - should get validations', () => {
//         comp.required = false;
//         expect(comp.getValidations()).toEqual({ required: false });
//     });

//     it('setFormCtrl - should set form control', () => {
//         comp.formCtrlSet = false;
//         comp.setFormCtrl();
//         expect(comp.formControl.value).toEqual('client.birthdate');
//     });

//     it('formClasses - should form classes', () => {
//         const classes = {
//             disabled: false,
//             emptyValue: false,
//             focused: false,
//             'ng-dirty': true,
//             'ng-invalid': false,
//             'ng-valid': true,
//             notEmptyValue: true,
//             required: false
//         }
//         comp.formClasses();
//         expect(comp.classes).toEqual(classes);
//     });

//     it('init - should initiate the datepicker', () => {
//         comp.init();
//         expect(comp.placeholder).toEqual('MMM D, YYYY');
//     });

//     it('onChangeInput - should change value from input', () => {
//         comp.modelDisplay = 'Feb 21, 2018';
//         comp.onChangeInput({model: '2018-02-21', evt: {keyCode: 13}});
//         expect(comp.lastModelDisplay).toEqual('Feb 21, 2018');
//     });

//     it('onChangeDatepicker - should update datepicker', () => {
//         comp.onChangeDatepicker({});
//         expect(comp.focused).toEqual(false);
//     });

//     it('onFocusInput - should set focused to true', () => {
//         comp.onFocusInput({focused: true, evt: {}})
//         expect(comp.focused).toEqual(true);
//     });

//     it('onBlurInput - should make request to blur event', () => {
//         comp.lastModelDisplay = 'Feb 21, 2018';
//         comp.modelDisplay = 'Mar 21, 2018';
//         comp.onBlurInput({blurred: true, evt: {}});
//         expect(comp.lastModelDisplay).toEqual('Mar 21, 2018');
//     });
    
//     it('toggleFocus - should set focused to false', () => {
//         comp.focused = true;
//         comp.toggleFocus();
//         expect(comp.focused).toEqual(false);
//     });

//     it('toggleFocus - should set focused to true', () => {
//         comp.focused = false;
//         comp.toggleFocus();
//         expect(comp.focused).toEqual(true);
//     });

//     it('isValidDate - should return false when date is below min date', () => {
//         expect(comp.isValidDate(moment('2016-02-19'))).toEqual(false);
//     });

//     it('isValidDate - should return false when date is above max date', () => {
//         expect(comp.isValidDate(moment('2020-02-19'))).toEqual(false);
//     });

//     it('isValidDate - should return true when date is within min and max date', () => {
//         expect(comp.isValidDate(moment('2018-02-19'))).toEqual(true);
//     });

//     it('setValFromInput - should not set value since input is invalid', () => {
//         comp.modelDisplay = 'Jan 41, 2017';
//         comp.lastModelDisplay = 'Mar 4, 2017';
//         comp.setValFromInput();
//         expect(comp.modelDisplay).toEqual('Mar 4, 2017');
//     });

//     it('setModel - should set the model to provided value', () => {
//         let newModel: string;
//         let modelChange: {};
//         comp.modelChange.subscribe((model: string) => newModel = model);
//         comp.onChange.subscribe((change: {}) => modelChange = change);
//         comp.setModel('2016-01-14'); 
//         expect(newModel).toEqual('2016-01-14');
//         expect(modelChange).toEqual({ model: '2016-01-14', oldVal: 'client.birthdate' })
//     });

//     it('setModel - should set the model to an empty string', () => {
//         let newModel: string;
//         let modelChange: {};
//         comp.modelChange.subscribe((model: string) => newModel = model);
//         comp.onChange.subscribe((change: {}) => modelChange = change);
//         comp.setModel(''); 
//         expect(newModel).toEqual('');
//         expect(modelChange).toEqual({ model: '', oldVal: 'client.birthdate' })
//     });

//     it('setModelDisplay - should set the model display to formatted model', () => {
//         comp.model = '2016-01-14';
//         comp.setModelDisplay();
//         expect(comp.modelDisplay).toEqual('Jan 14, 2016');
//     });

//     it('setModelDisplay - should set the model display to empty string', () => {
//         comp.model = '';
//         comp.setModelDisplay();
//         expect(comp.modelDisplay).toEqual('');
//     });
// });
