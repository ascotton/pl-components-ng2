import { Component, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLLodashService } from '../pl-lodash/pl-lodash.service';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-select-api',
    templateUrl: './pl-input-select-api.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-select-api.component.less'],
    inputs: [
        'model',
        'options',
        'filterPlaceholder',
        'label',
        'required',
        'disabled',
        'validationMessages',
        'formCtrl',
        'debounce',
        'loading',
        'noResultsText',
        'modelOptions',
        'styleInline',
        'searchByDefault',
        'searchOnBlankFocus',
        'dropdownContainerSelector',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputSelectApiComponent),
            multi: true,
        },
    ],
})
export class PLInputSelectApiComponent implements ControlValueAccessor {
    @ViewChild('inputFilter') inputFilter: ElementRef;

    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onSearch = new EventEmitter<any>();

    model: any = '';
    options: any[] = [];
    filterPlaceholder: string = 'Type to search..';
    label: string = '';
    required: boolean = false;
    disabled: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    debounce: number = 1000;
    loading: boolean = false;
    noResultsText: string = 'No results found';
    // To display the label for the selected values in the model,
    // we need them for each model value. We will keep track of
    // looked up options, but this is for initially selected options,
    // before a (matching) search has happened for each model value.
    modelOptions: any[] = [];
    styleInline: boolean = false;
    searchByDefault: boolean = false;
    searchOnBlankFocus: boolean = false;
    dropdownContainerSelector: string = 'body';

    private modelLabelOptions: any[] = [];

    name: string = '';
    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;

    filterModel: string = '';
    focused: boolean = false;
    filteredOptions: any[] = [];

    searchTimeoutTrigger: any = -1;

    // Using invalid directly gives "Expression has changed after it was checked" angular error..
    classes: any = {};

    constructor(
        private plLodash: PLLodashService,
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
        this.setOptions();
        if (this.searchByDefault || this.filterModel) {
            this.search(true);
        }
    }

    ngOnChanges(changes: any) {
        this.init();
        if (changes.options) {
            this.setOptions();
        }
        if (changes.modelOptions) {
            this.modelLabelOptions = this.modelOptions;
            this.setOptions();
        }
        if (changes.model && !changes.model.currentValue) {
            this.filterModel = '';
        }
        if (
            (changes.searchByDefault && changes.searchByDefault.currentValue) ||
            (changes.filterModel && changes.filterModel.currentValue)
        ) {
            this.search(true);
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
        const classes1: any = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'selectApi',
            this.formControl
        );
        classes1.styleInline = this.styleInline;
        this.classesContainer = classes1;
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
        this.classes = this.classesContainer;
    }

    init() {
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
        this.filterModel = this.getLabelFromModel();
    }

    setOptions() {
        const filteredOpts: any[] = [];
        this.options.forEach((option: any) => {
            filteredOpts.push(option);
            // If we do not have this model label yet, add it.
            const index = this.plLodash.findIndex(this.modelLabelOptions, 'value', option.value);
            if (index < 0) {
                this.modelLabelOptions.push(option);
            }
        });
        this.filteredOptions = filteredOpts;
    }

    onChangeFilter(newVal: string) {
        this.search();
    }

    onFocusFilter(info: { focused: boolean; evt: any }) {
        this.focused = true;
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
        this.formClasses();
        if (this.searchOnBlankFocus && !this.filterModel) {
            this.search(true);
        }
    }

    onBlurFilter(info: { blurred: boolean; evt: any }) {
        this.unFocus();
    }

    unFocus() {
        if (!this.inputFilter.nativeElement.contains(document.activeElement)) {
            this.focused = false;
            this.formClasses();
        }
    }

    getLabelFromModel() {
        let option: any;
        if (this.model) {
            for (let ii = 0; ii < this.modelLabelOptions.length; ii++) {
                option = this.modelLabelOptions[ii];
                if (option.value === this.model) {
                    return option.label;
                }
            }
            return this.model;
        }
        // return '';
        return this.filterModel;
    }

    search(ignoreSame: boolean = false) {
        if (
            (this.onSearch && (ignoreSame || !this.filterModel)) ||
            (!this.model || (this.model.toLowerCase() !== this.filterModel.toLowerCase()))
        ) {
            if (this.searchTimeoutTrigger) {
                clearTimeout(this.searchTimeoutTrigger);
            }
            this.searchTimeoutTrigger = setTimeout(() => {
                if (!ignoreSame) {
                    this.setModel('');
                }
                this.onSearch.emit({ value: this.filterModel });
            }, this.debounce);
        }
    }

    setModel(val: any, label: string = '') {
        const oldVal = this.model;
        const model = val;
        this.propagateChange(model);
        this.modelChange.emit(model);
        if (this.onChange) {
            const vals: any = { model: model, oldVal: oldVal };
            if (label) {
                vals.label = label;
            }
            this.onChange.emit(vals);
        }
        this.plInputErrors.reValidate(model, this.formControl, this.getValidations());
    }

    selectOption(option: any) {
        // Prevent search changing / blanking out model after select.
        if (this.searchTimeoutTrigger) {
            clearTimeout(this.searchTimeoutTrigger);
        }
        this.setModel(option.value, option.label);
        // Give model time to update.
        setTimeout(() => {
            this.filterModel = this.getLabelFromModel();
        }, 0);
        this.focused = false;
        this.formClasses();
    }
}
