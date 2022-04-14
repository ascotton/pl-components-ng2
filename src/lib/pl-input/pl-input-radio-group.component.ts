import { Component, Output, EventEmitter, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-radio-group',
    templateUrl: './pl-input-radio-group.component.html',
    styleUrls: [
        './pl-input-shared.component.less',
        './pl-input-checkbox-radio-group.component.less',
        './pl-input-radio-group.component.less',
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
        'name',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputRadioGroupComponent),
            multi: true,
        },
    ],
})
export class PLInputRadioGroupComponent implements ControlValueAccessor {
    @ViewChild('optionsContainer') element: ElementRef;
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: any = '';
    label: string = '';
    options: any[] = [];
    horizontal: boolean = false;
    required: boolean = false;
    disabled: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    optionWidth: string = '250px';
    name: string = '';

    optionsUse: any[] = [];

    classesContainer: any = {
        horizontal: false,
    };
    formCtrlSet: boolean = false;
    formControl: any = null;
    focused: boolean = false;
    stylesOption: any = {
        width: this.optionWidth,
    };

    private optionsContainer: any;

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

    ngAfterViewInit() {
        this.getNativeElements();
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
        let classesContainer: any = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'radioGroup',
            this.formControl
        );
        classesContainer.horizontal = this.horizontal;
        this.classesContainer = classesContainer;
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
    }

    init() {
        // if (!this.model) {
        //     this.model = '';
        // }
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations(), false);
        }
        this.formClasses();
        this.classesContainer.horizontal = this.horizontal;
        this.stylesOption.width = this.optionWidth;
        this.formOptions();
    }

    formOptions() {
        let opt: any;
        this.optionsUse = this.options.map((option: any) => {
            opt = Object.assign({}, option);
            if (opt.disabled === undefined || this.disabled) {
                opt.disabled = this.disabled;
            }
            return opt;
        });
    }

    changeOpt(opt: any) {
        const oldVal = this.model;
        // Use timeout to ensure value is updated correctly.
        setTimeout(() => {
            this.model = opt.value;
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

    onKeyDown(event: any) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            if (!this.optionsContainer) return;

            let activeOptionIndex = -1;
            for (let i = 0; i < this.optionsContainer.children.length; i++) {
                if (this.optionsContainer.children[i].contains(document.activeElement)) {
                    activeOptionIndex = i;
                    break;
                }
            }

            if (activeOptionIndex > -1) {
                const direction = ((event.key === 'ArrowDown') ? 1 : -1);
                let newVal = activeOptionIndex;
                while (true) {
                    newVal += direction;

                    if (newVal < 0 || newVal >= this.optionsContainer.children.length) {
                        break;
                    }

                    const option = this.optionsContainer.children[newVal].getElementsByTagName('input')[0];

                    if (!option.disabled) {
                        option.focus();
                        break;
                    }
                }
            }

            event.stopPropagation();
            event.preventDefault();
            return;
        }

        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumPadEnter') {
            if (!this.optionsContainer) return;

            for (let i = 0; i < this.optionsContainer.children.length; i++) {
                if (this.optionsContainer.children[i].contains(document.activeElement)) {
                    this.optionsContainer.children[i].getElementsByTagName('input')[0].click();
                    setTimeout(() => {
                        this.optionsContainer.children[i].getElementsByTagName('input')[0].focus();
                    }, 1);
                    break;
                }
            }

            event.stopPropagation();
            event.preventDefault();
        }
    }

    private getNativeElements() {
        try {
            this.optionsContainer = this.element.nativeElement;
        } catch {
            setTimeout(() => {
                this.getNativeElements();
            }, 10);
        }
    }

    private markAsTouched(): void {
        if(this.formControl) {
            this.formControl.markAsTouched();
        }
    }
}
