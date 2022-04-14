import { Component, Output, EventEmitter, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-checkbox',
    templateUrl: './pl-input-checkbox.component.html',
    styleUrls: [
        './pl-input-shared.component.less',
        './pl-input-checkbox-radio.component.less',
        './pl-input-checkbox.component.less',
    ],
    inputs: ['clickableAreaExpanded', 'model', 'label', 'disabled', 'name', 'required', 'validationMessages', 'formCtrl', 'noPadding', 'clickableAreaExpanded'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputCheckboxComponent),
            multi: true,
        },
    ],
})
export class PLInputCheckboxComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild('inputCheckBox') inputCheckBoxRef: ElementRef;
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: boolean = false;
    label: string = '';
    disabled: boolean = false;
    required: boolean = false;
    name: string = null;
    validationMessages: any = {};
    formCtrl: any;
    noPadding: boolean = false;
    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;
    focused: boolean = false;
    clickableAreaExpanded = false;

    constructor(private plInputErrors: PLInputErrorsService, private plInputShared: PLInputSharedService) { }

    // To enabled form validation.
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    writeValue(value: any) { }
    propagateChange = (_: any) => { };
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    registerOnTouched() { }

    ngOnChanges(changes: any) {
        this.init();
    }

    ngOnInit() {
        this.setFormCtrl();
        this.init();
    }

    ngAfterViewInit() {
        this.expandClickableAreaOfCheckbox();
    }

    getValidations() {
        return { checkboxrequired: this.required };
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
                    this.getValidations(),
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
            'checkbox',
            this.formControl
        );
        this.classesContainer.noPadding = this.noPadding;
        this.plInputErrors.setDisabled(this.formControl, this.disabled);
    }

    init() {
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
    }

    change() {
        const oldVal = this.model;
        // Need timeout to allow model to get value that was just set.
        setTimeout(() => {
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

    private expandClickableAreaOfCheckbox() {
        const inputCheckBoxElement = this.inputCheckBoxRef.nativeElement.children[0];

        if (inputCheckBoxElement) {
            inputCheckBoxElement.style.display = this.clickableAreaExpanded ? 'flex' : 'inline-flex';
        }
    }
}
