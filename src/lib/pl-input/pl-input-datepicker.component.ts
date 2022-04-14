import { Component, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { PLInputDropdownService } from './pl-input-dropdown.service';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-datepicker',
    templateUrl: './pl-input-datepicker.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-datepicker.component.less'],
    inputs: [
        'model',
        'label',
        'placeholder',
        'closeDatePickerInModal',
        'disabled',
        'required',
        'validationMessages',
        'formCtrl',
        'formatDisplay',
        'format',
        'firstDayOfWeek',
        'minDate',
        'maxDate',
        'selectedRange',
        'todayRange',
        'monthOptsFormat',
        'dropdownContainerSelector',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputDatepickerComponent),
            multi: true,
        },
    ],
})
export class PLInputDatepickerComponent implements ControlValueAccessor {
    // tslint:disable-next-line: no-input-rename
    @Input('reverseYearSort') reverseYearSort: boolean;
    // tslint:disable-next-line: no-input-rename
    @Input('scrollToYearByLabel') scrollToYearByLabel: string | number;
    // tslint:disable-next-line: no-input-rename
    @Input('scrollToYearByValue') scrollToYearByValue: string | number;

    @ViewChild('input') input: ElementRef;
    @ViewChild('dropdown') dropdown: ElementRef;

    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: string = '';
    label: string = '';
    disabled: boolean = false;
    required: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    format: string = 'YYYY-MM-DD';
    formatDisplay: string = 'MM/DD/YYYY';
    placeholder: string;
    firstDayOfWeek: number;
    minDate: string;
    maxDate: string;
    selectedRange: string;
    todayRange: string;
    monthOptsFormat: string;
    dropdownContainerSelector: string = 'body';
    closeDatePickerInModal = false;

    name: string = '';

    // Using invalid directly gives "Expression has changed after it was checked" angular error..
    classes: any = {};
    classesContainer: any = {};

    selectButtonKeyEventcode = '';

    formCtrlSet: boolean = false;
    focused: boolean = false;
    formControl: any = null;

    inputDropDownFocusIn = false;

    lastModelDisplay: string = '';

    modelDisplay: string = '';
    minMaxFormat = 'YYYY-MM-DD';

    // yearToScrollByLabel = null;
    // yearToScrollByValue = null;

    constructor(
        private plInputDropdown: PLInputDropdownService,
        private plInputErrors: PLInputErrorsService,
        private plInputShared: PLInputSharedService
    ) { }

    // To enabled form validation.
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    writeValue(value: any) { }
    propagateChange = (_: any) => { };
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    registerOnTouched() { }

    ngOnInit() {
        this.setFormCtrl();
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();

        // When picker in modal; the closing of it clicking outside gets difficult
        // Therefore this input property used for closing the picker in a modal
        if (this.closeDatePickerInModal) {
            this.focused = false;
            this.formClasses();
        }
    }

    getValidations() {
        return { required: this.required };
    }

    setFormCtrl() {
        this.name = this.plInputErrors.setName(this.name);
        if (!this.formCtrlSet) {
            this.formCtrlSet = true;
            if (this.formCtrl) {
                this.plInputErrors.addFormControl(
                    this.formCtrl,
                    this.name,
                    this.model,
                    this.disabled,
                    this.getValidations()
                );
                this.formControl = this.formCtrl.controls[this.name];
            }
        }
    }

    formClasses() {
        this.classesContainer = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'datepicker',
            this.formControl
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
        this.classes = this.classesContainer;
    }

    init() {
        if (this.placeholder === undefined) {
            this.placeholder = this.formatDisplay;
        }
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }

        this.formClasses();
        this.setModelDisplay();
    }

    styleNoValidate() {
        // Designer request: do not want to show valid or invalid while typing.
        this.classes['ng-invalid'] = false;
        this.classes['ng-valid'] = false;
    }

    /**
     * Open the picker using the Enter key.
     * Close the picker using the Esc key.
     */
    onDatePickerKeyUp(event: KeyboardEvent) {
        if (event && event.code) {
            switch (event.code) {
                    case 'Enter':
                        this.openDatePicker();
                        break;

                    case 'Escape':
                        this.focused = false;
                        this.formClasses();
                        break;
            }
        }
    }

    onChangeInput(info: { model: string; evt: any }) {
        this.styleNoValidate();

        const keyCodeEnter = 13;
        if (info.evt.keyCode === keyCodeEnter) {
            this.setValFromInput();
        }
    }

    onChangeDatepicker() {
        this.setModelDisplay();
        this.setModel(this.model);
        this.focused = false;
        this.formClasses();
    }

    openDatePicker() {
        this.focused = true;
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
        this.formClasses();
        this.styleNoValidate();
    }

    onBlurInput(info: { blurred: boolean; evt: any }) {
        if (this.lastModelDisplay !== this.modelDisplay) {
            this.setValFromInput();
        }

        this.unFocus(info);
    }

    onBlurDropdown(info: { blurred: boolean; evt: any }) {
        if (info.blurred) {
            this.unFocus(info);
        }
    }

    toggleFocus() {
        this.focused = !this.focused;
        this.formClasses();
    }

    isValidDate(dateMoment: any) {
        const date = dateMoment.format(this.minMaxFormat);
        if (this.minDate && date < this.minDate) {
            return false;
        }
        if (this.maxDate && date > this.maxDate) {
            return false;
        }
        return true;
    }

    setValFromInput() {
        if (!this.modelDisplay) {
            this.setModel('');
        } else {
            let value = moment(this.modelDisplay, this.formatDisplay, true);
            if (!value.isValid() || !this.isValidDate(value)) {
                this.modelDisplay = this.lastModelDisplay;
                // this.setModel('');
            } else {
                this.setModel(value.format(this.format));
            }
        }
        this.lastModelDisplay = this.modelDisplay;
    }

    unFocus(evt: any) {
        const notFocusEvent = evt.evt.type !== 'blur';

        if (notFocusEvent) {
            const innerEvent = evt.evt;

            const elementNotInDropdownOrInput = (
                !this.input.nativeElement.contains(document.activeElement) &&
                !this.dropdown.nativeElement.contains(document.activeElement)
            );

            const path = innerEvent.path || (innerEvent.composedPath && innerEvent.composedPath());
            const calendarIconClicked = path.find((el: any) => el.className === 'pl-icon-svg');

            if (elementNotInDropdownOrInput && !calendarIconClicked) {
                this.focused = false;
                this.formClasses();
            }
        }
    }

    setModel(val: any) {
        const oldVal = this.model;
        this.propagateChange(val);
        this.modelChange.emit(val);
        if (this.onChange) {
            this.onChange.emit({ model: val, oldVal: oldVal });
        }
        this.plInputErrors.reValidate(val, this.formControl, this.getValidations());
        this.formClasses();
    }

    setModelDisplay() {
        if (!this.model) {
            this.modelDisplay = '';
        } else if (this.model && moment(this.model, this.format, true).isValid()) {
            this.modelDisplay = moment(this.model, this.format).format(this.formatDisplay);
        }
        this.lastModelDisplay = this.modelDisplay;
    }
}
