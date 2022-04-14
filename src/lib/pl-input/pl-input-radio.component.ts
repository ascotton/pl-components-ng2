import { Component, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-radio',
    templateUrl: './pl-input-radio.component.html',
    styleUrls: [
        './pl-input-shared.component.less',
        './pl-input-checkbox-radio.component.less',
        './pl-input-radio.component.less',
    ],
    inputs: ['model', 'value', 'label', 'disabled', 'formCtrl', 'name'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputRadioComponent),
            multi: true,
        },
    ],
})
export class PLInputRadioComponent implements ControlValueAccessor {
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: any = '';
    value: any = '';
    label: string = '';
    disabled: boolean = false;
    formCtrl: any;
    name: string = (Math.random() + 1).toString(36).substring(7);

    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;
    focused: boolean = false;
    required: boolean = false;

    valueMask: any;
    modelMask: any;

    constructor(private plInputErrors: PLInputErrorsService, private plInputShared: PLInputSharedService) {}

    // To enabled form validation.
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    writeValue(value: any) {}
    propagateChange = (_: any) => {};
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    registerOnTouched() {}

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();
    }

    formClasses() {
        this.classesContainer = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.modelMask,
            'radio',
            this.formControl
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled);
    }

    init() {
        this.valueMask = this.value;
        this.modelMask = this.model;
        if (this.value === false) {
            this.valueMask = '[falsy]';
            if (this.model === this.value) {
                this.modelMask = this.valueMask;
            }
        }
        // if (this.model) {
        //     this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        // }
        this.formClasses();
    }

    change() {
        const oldVal = this.model;
        // Need timeout to allow model to get value that was just set.
        setTimeout(() => {
            // This seems to never be true and thus prevents the model from updating.
            // Removing it seems to fix things without causing any regressions. Commenting out for now.
            // if (this.modelMask === this.valueMask && this.value !== this.valueMask) {
                this.model = this.value;
            // }
            this.propagateChange(this.model);
            this.modelChange.emit(this.model);
            if (this.onChange) {
                this.onChange.emit({ model: this.model, oldVal: oldVal });
            }
            this.formClasses();
            if (this.formControl) {
                this.formControl.markAsTouched();
            }
        }, 0);
    }
}
