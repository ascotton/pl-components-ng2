import { Component, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-checkbox-group',
    templateUrl: './pl-input-checkbox-group.component.html',
    styleUrls: [
        './pl-input-shared.component.less',
        './pl-input-checkbox-radio-group.component.less',
        './pl-input-checkbox-group.component.less',
    ],
    inputs: [
        'model',
        'label',
        'options',
        'horizontal',
        'disabled',
        'required',
        'validationMessages',
        'formCtrl',
        'optionWidth',
        'col2',
        'col3',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputCheckboxGroupComponent),
            multi: true,
        },
    ],
})
export class PLInputCheckboxGroupComponent implements ControlValueAccessor {
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: any = [];
    label: string = '';
    options: any[] = [];
    horizontal: boolean = false;
    required: boolean = false;
    disabled: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    optionWidth: string = '250px';

    name: string = '';
    classesContainer: any = {
        horizontal: false,
    };
    formCtrlSet: boolean = false;
    formControl: any = null;
    focused: boolean = false;
    stylesOption: any = {
        width: this.optionWidth,
    };
    col2 = false;
    col3 = false;
    classesCols = '';

    opts: any[] = [];

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
        this.setFormCtrl();
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();
    }

    getValidations() {
        return { arrayrequired: this.required };
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
        let classesContainer: any = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'checkboxGroup',
            this.formControl
        );
        classesContainer.horizontal = this.horizontal;
        this.classesContainer = classesContainer;
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
    }

    init() {
        if (!this.model) {
            this.model = [];
        }
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations(), false);
        }
        this.formClasses();
        this.classesContainer.horizontal = this.horizontal;
        this.stylesOption.width = this.optionWidth;

        if (this.col2) {
            this.classesCols = 'cols cols2';
            this.stylesOption.width = '100%';
        } else if (this.col3) {
            this.classesCols = 'cols cols3';
            this.stylesOption.width = '100%';
        }

        this.formOpts();
    }

    formOpts() {
        if (!this.options || !this.options.length) {
            this.opts = [];
        } else {
            this.opts = this.options.map((opt: any) => {
                return Object.assign({}, opt, {
                    selected: this.model && this.model.indexOf(opt.value) > -1 ? true : false,
                });
            });
        }
    }

    changeOpt(opt: any) {
        const oldVal = this.model;
        // Use timeout to ensure value is updated correctly.
        setTimeout(() => {
            const index = this.model.indexOf(opt.value);
            if (opt.selected) {
                if (index < 0) {
                    this.model.push(opt.value);
                }
            } else {
                if (index > -1) {
                    this.model.splice(index, 1);
                }
            }
            this.markAsTouched();
            this.propagateChange(this.model);
            this.modelChange.emit(this.model);
            if (this.onChange) {
                this.onChange.emit({ model: this.model, oldVal: oldVal });
            }
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
            this.formClasses();
        }, 0);
    }

    private markAsTouched(): void {
        if(this.formControl) {
            this.formControl.markAsTouched();
        }
    }
}
