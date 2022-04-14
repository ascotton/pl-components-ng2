import { Component, Output, EventEmitter, forwardRef, OnChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-textarea',
    templateUrl: './pl-input-textarea.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-text-textarea.component.less'],
    inputs: [
        'model',
        'resizable',
        'height',
        'placeholder',
        'label',
        'required',
        'minlength',
        'maxlength',
        'disabled',
        'autocomplete',
        'name',
        'pattern',
        'validationMessages',
        'formCtrl',
        'debounceChange',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputTextareaComponent),
            multi: true,
        },
    ],
})
export class PLInputTextareaComponent implements OnInit, OnChanges, ControlValueAccessor {
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onKeydownTab = new EventEmitter<any>();

    model: string = '';
    resizable: boolean = false;
    height: any = '100px';
    placeholder: string = '';
    label: string = '';
    required: boolean = false;
    minlength: number = null;
    maxlength: number = null;
    disabled: boolean = false;
    autocomplete: string = 'on';
    name: string = null;
    pattern: string = null;
    validationMessages: any = {};
    formCtrl: any;
    debounceChange: number = 0;

    focused: boolean = false;

    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;

    stylesContainer: any = {
        height: this.height,
    };

    private timeoutChange: any = null;

    constructor(private plInputErrors: PLInputErrorsService, private plInputShared: PLInputSharedService) { }

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
        this.formClasses();
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
            'textarea',
            this.formControl
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled);
    }

    init() {
        this.stylesContainer.height = this.height;
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
    }

    blur() {
        this.focused = false;
        this.formClasses();
    }

    focus() {
        this.focused = true;
        this.formClasses();
    }

    change(evt: any) {
        const oldVal = this.model;
        this.formClasses();
        this.propagateChange(this.model);
        this.modelChange.emit(this.model);

        if (this.onChange) {
            if (this.timeoutChange) {
                clearTimeout(this.timeoutChange);
            }
            this.timeoutChange = setTimeout(() => {
                this.onChange.emit({
                    model: this.model,
                    oldVal: oldVal,
                    evt: evt,
                });
            }, this.debounceChange);
        }
    }

    keydownTab(event: any) {
        // pass the original event in a container object
        this.onKeydownTab.emit({ event });
    }
}
