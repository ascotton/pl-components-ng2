import { Component, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, forwardRef, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { PLInputDropdownService } from './pl-input-dropdown.service';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-time',
    templateUrl: './pl-input-time.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-time.component.less'],
    inputs: [
        'model',
        'label',
        'placeholder',
        'disabled',
        'required',
        'validationMessages',
        'formCtrl',
        'formatDisplay',
        'format',
        'start',
        'numHours',
        'minutesStep',
        'minTime',
        'maxTime',
        'dropdownContainerSelector',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputTimeComponent),
            multi: true,
        },
    ],
})
export class PLInputTimeComponent implements ControlValueAccessor {
    @ViewChild('input') input: ElementRef;
    @ViewChild('dropdown') dropdown: ElementRef;

    @Input() showOptions = true;

    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: string = '';
    label: string = '';
    disabled: boolean = false;
    required: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    format: string = 'HH:mm';
    // Pending the browser, this may be overwritten by the native `time` input format.
    formatDisplay: string = 'h:mma';
    minTime: string = '00:00';
    maxTime: string = '23:59';
    start: string = '06:00';
    numHours: number = 24;
    minutesStep: number = 30;
    dropdownContainerSelector: string = 'body';

    name: string = '';
    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;
    // Using invalid directly gives "Expression has changed after it was checked" angular error..
    classes: any = {};

    // Pending the browser, may be overwritten by native `time` input format.
    private modelInputFormat: string = 'HH:mm';
    private modelInputFormatDisplay: string = 'hh:mm A';
    modelInput: string = '';
    focused: boolean = false;
    private lastModelInput: string = '';
    private minMaxFormat = 'HH:mm';
    timeOptions: any[] = [];

    private formatDisplayFinal: string = '';
    private formatFinal: string = '';
    // placeholder: string = this.formatDisplay;
    placeholder: string = '';
    hasOptionsOpened: boolean = false;

    constructor(
        private _ngZone: NgZone,
        private cdRef: ChangeDetectorRef,
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
            'time',
            this.formControl
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
        this.classes = this.classesContainer;
    }

    init() {
        this.setFormats();
        if (this.model && moment(this.model, this.format, true).isValid()) {
            this.modelInput = moment(this.model, this.format, true).format(this.formatFinal);
        } else {
            this.modelInput = '';
        }
        this.setModelInput();
        this.timeOptions = this.formTimeOpts(this.start, this.numHours, this.minutesStep);
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
    }

    /**
    // We have options for formats, but the native `time` input may require certain ones that will
    // override them. So this will give us the final 3 formats:
    - input & dropdown value
    - input & dropdown display
    */
    setFormats() {
        // TODO - for certain browsers / platforms, change the formats.
        this.formatDisplayFinal = this.modelInputFormatDisplay;
        this.formatFinal = this.modelInputFormat;
        this.placeholder = this.formatDisplayFinal;
    }

    formTimeOpts(
        startString: string = '06:00',
        numHours: number = 24,
        minutesStep: number = 30,
        startDate: string = null,
        endDate: string = null
    ) {
        const dateFormat = 'YYYY-MM-DD';
        const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
        const timeFormat = this.formatFinal;
        const timeLabelFormat = this.formatDisplayFinal;

        let time = moment(startString, timeFormat);
        const opts: any[] = [];
        const numOpts = Math.floor(numHours * 60 / minutesStep);
        let counter = 0;
        let endLabel: string;
        let startDateTime = startDate ? moment(`${startDate} ${startString}:00`, dateTimeFormat) : null;
        let endDateTime: any;
        let endTime: string;
        let duration: string;
        let durationUnit: string;
        let lastTime = time.format(timeFormat);
        for (let ii = 0; ii < numOpts; ii++) {
            endTime = time.format(timeFormat);
            endLabel = time.format(timeLabelFormat);
            if (startDateTime && endDate) {
                if (lastTime !== '00:00' && endTime === '00:00') {
                    endDate = moment(endDate, dateFormat).add(1, 'days').format(dateFormat);
                }
                endDateTime = moment(`${endDate} ${endTime}:00`, dateTimeFormat);
                if (endDateTime.diff(startDateTime, 'days') >= 1) {
                    duration = endDateTime.diff(startDateTime, 'days', true).toFixed(1);
                    durationUnit = duration === '1.0' ? 'day' : 'days';
                } else {
                    duration = endDateTime.diff(startDateTime, 'hours', true).toFixed(1);
                    durationUnit = duration === '1.0' ? 'hr' : 'hrs';
                }
                endLabel += ` (${duration} ${durationUnit})`;
                lastTime = time.format(timeFormat);
            }
            opts.push({
                value: endTime,
                label: endLabel,
            });
            time.add(minutesStep, 'minutes');
        }
        return opts;
    }

    onChangeInput(info: { model: string; evt: any }) {
        // KeyboardEvent.keyCode is deprecated https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if (info.evt && info.evt.code) {
            switch (info.evt.code) {
                    case 'Enter':
                        setTimeout(() => {
                            this.setValFromInput();
                            this.formClasses();
                            this.hasOptionsOpened = true;
                        }, 0);
                        break;

                    case 'Escape':
                        this.hasOptionsOpened = false;
                        break;
            }
        }
    }

    selectOption(option: any) {
        let value = moment(option.value, this.formatFinal, true);
        if (!this.isValidTime(value)) {
            this.modelInput = this.lastModelInput;
        } else {
            this.modelInput = option.value;
            this.setModel(option.value);
            this.focused = false;
            this.formClasses();
        }
        this.hasOptionsOpened = false;
    }

    onFocusInput(info: { focused: boolean; evt: any }) {
        this.focused = true;
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
        const opt = this.timeOptions.findIndex(({ value }) => value === this.model);
        if (opt > 0) {
            const elem = this.dropdown.nativeElement.parentElement.parentElement;
            setTimeout(() => elem.scrollTop = opt * 35, 0);
            /*
            None of this seem to work
            elem.scrollTop = opt * 35;
            this.cdRef.detectChanges();
            this._ngZone.runOutsideAngular(() => elem.scrollTop = opt * 35);
            */
        }
        this.formClasses();
    }

    onBlurInput(info: { blurred: boolean; evt: any }) {
        // If here, this prevents clicking an option the first time..
        // if (!this.dropdownClicked(info.evt)) {
        //     if ((this.lastModelInput !== this.modelInput) || !this.modelInput) {
        //         setTimeout(() => {
        //             this.setValFromInput();
        //         }, 0);
        //     }
        //     this.unFocus(info.evt);
        // }
        this.unFocus(info.evt);
    }

    dropdownClicked(evt: any) {
        if (
            this.dropdown.nativeElement.contains(evt.target) ||
            this.plInputDropdown.clickInRect(this.dropdown.nativeElement, evt)
        ) {
            return true;
        }
        return false;
    }

    isValidTime(timeMoment: any) {
        const time = timeMoment.format(this.minMaxFormat);
        if (this.minTime && time < this.minTime) {
            return false;
        }
        if (this.maxTime && time > this.maxTime) {
            return false;
        }
        return true;
    }

    setValFromInput() {
        if (!this.modelInput) {
            this.setModel('');
        } else {
            let value = moment(this.modelInput, this.formatFinal, true);
            if (!value.isValid() || !this.isValidTime(value)) {
                this.modelInput = this.lastModelInput;
                // this.setModel('');
            } else {
                this.setModel(value.format(this.formatFinal));
            }
        }
        this.lastModelInput = this.modelInput;
    }

    unFocus(evt: any) {
        const isKeyTab = evt.code === 'Tab';
        const nativeHasEvtTarget = this.input.nativeElement.contains(evt.target);
        const nativeHasActiveElement = this.input.nativeElement.contains(document.activeElement);

        if (isKeyTab && !nativeHasActiveElement) {
            this.focused = false;
            this.formClasses();
            this.hasOptionsOpened = false;
        } else if (!nativeHasEvtTarget && !nativeHasActiveElement) {
            this.focused = false;
            this.formClasses();
            this.hasOptionsOpened = false;
        }
    }

    onBlurDropdown(info: { blurred: boolean; evt: any }) {
        if (info.blurred && this.focused && !this.input.nativeElement.contains(info.evt.target)) {
            this.unFocus(info.evt);
        }
    }

    // Listen for key press on number increment.
    inputEvent(evt: any) {
        let value = moment(evt.target.value, this.formatFinal, true);
        if (value.isValid() && this.isValidTime(value)) {
            setTimeout(() => {
                this.setModel(value.format(this.formatFinal));
            }, 0);
        }
    }

    setModel(val: any) {
        this.modelInput = val;
        this.updateModel();
    }

    updateModel() {
        const oldVal = this.model;
        const model = this.modelInput ? moment(this.modelInput, this.formatFinal).format(this.format) : '';
        this.propagateChange(model);
        this.modelChange.emit(model);
        if (this.onChange) {
            this.onChange.emit({ model: model, oldVal: oldVal });
        }
        this.plInputErrors.reValidate(model, this.formControl, this.getValidations());
        this.formClasses();
    }

    setModelInput() {
        // if (!this.modelInput) {
        //     this.modelInput = '';
        // } else if (this.modelInput && moment(this.modelInput, this.formatFinal, true).isValid()) {
        //     this.modelInput = moment(this.modelInput, this.formatFinal).format(this.formatFinal);
        // }
        this.lastModelInput = this.modelInput;
    }

    toggleOptionsOpen() {
        this.hasOptionsOpened = true;
        this.input.nativeElement.querySelector('input').focus();
    }
}
