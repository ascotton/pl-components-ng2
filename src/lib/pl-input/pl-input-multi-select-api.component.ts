import { Component, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLLodashService } from '../pl-lodash/pl-lodash.service';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-multi-select-api',
    templateUrl: './pl-input-multi-select-api.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-multi-select-api.component.less'],
    inputs: [
        'model',
        'options',
        'filterPlaceholder',
        'label',
        'disabled',
        'required',
        'validationMessages',
        'formCtrl',
        'debounce',
        'loading',
        'noResultsText',
        'resultsLimitedText',
        'resultsTotalCount',
        'modelOptions',
        'searchByDefault',
        'dropdownContainerSelector',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputMultiSelectApiComponent),
            multi: true,
        },
    ],
})
export class PLInputMultiSelectApiComponent implements ControlValueAccessor {
    @ViewChild('inputFilter') inputFilter: ElementRef;
    @ViewChild('inputMultiSelect') inputMultiSelect: ElementRef;

    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onSearch = new EventEmitter<any>();

    model: string[] = [];
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
    resultsLimitedText = '';
    resultsTotalCount: number = null;
    // To display the label for the selected values in the model,
    // we need them for each model value. We will keep track of
    // looked up options, but this is for initially selected options,
    // before a (matching) search has happened for each model value.
    modelOptions: any[] = [];
    searchByDefault: boolean = false;
    dropdownContainerSelector: string = 'body';

    private keyEventsMap: any; // The allowed keyboard events for dropdown.
    private dropDownIndex = -1; // For keyboard navigation in dropdown
    private dropDownNativeOptions: any[]; // Will hold the DOM options selected and filtered.
    private dropdownNativeElement: any;
    private optionMessages: any;
    private searchInputElement: any;

    private modelLabelOptions: any[] = [];

    private lastSearchVal: string = null;

    name: string = '';
    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;

    filteredOptions: any[] = [];
    filterModel: string = '';
    selectedText: string = '';
    focused: boolean = false;

    selectedOptions: any[] = [];

    searchTimeoutTrigger: any = -1;

    // Using invalid directly gives "Expression has changed after it was checked" angular error..
    classes: any = {};
    // Variable used for do not load errors until user opens the box, so that no error state is defaulted.
    private multiSelectFocused = false;

    constructor(
        private plLodash: PLLodashService,
        private plInputErrors: PLInputErrorsService,
        private plInputShared: PLInputSharedService,
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
        this.setDropDownIndex(-1);
        if (this.searchByDefault || this.filterModel) {
            this.search();
        }
    }

    ngAfterViewInit() {
        this.keyEventsMap = {
            ArrowUp: -1,
            ArrowDown: 1,
        };
        this.getNativeElements();
    }

    ngOnChanges(changes: any) {
        this.init();
        if (changes.options || changes.model) {
            this.setOptions();
        }
        if (changes.modelOptions) {
            this.modelLabelOptions = this.modelOptions;
            this.setOptions();
        }
        if (
            (changes.searchByDefault && changes.searchByDefault.currentValue) ||
            (changes.filterModel && changes.filterModel.currentValue)
        ) {
            this.search();
        }
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
                    false, // Fixed to false in order to not load errors until user opens the box.
                );
                this.formControl = this.formCtrl.controls[this.name];
            }
        }
    }

    formClasses() {
        this.classesContainer = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            false, // Fixed to false in order to not load errors until user opens the box.
            this.model,
            'multiSelectApi',
            this.formControl,
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
        this.classes = this.classesContainer;
    }

    init() {
        if (!this.model) {
            this.model = [];
        }
        this.setSelectedText();
        this.formClasses();
    }

    setSelectedText() {
        this.selectedText = this.model.length ? `${this.model.length} selected` : '';
    }

    setOptions() {
        let selected: boolean = false;
        const filteredOpts: any[] = [];
        this.options.forEach((option: any) => {
            selected = this.model.indexOf(option.value) > -1 ? true : false;
            if (!selected) {
                filteredOpts.push(Object.assign({}, option, { selected: false }));
            } else {
                // If we do not have this model label yet, add it.
                const index = this.plLodash.findIndex(this.modelLabelOptions, 'value', option.value);
                if (index < 0) {
                    this.modelLabelOptions.push(option);
                }
            }
        });
        this.filteredOptions = filteredOpts;
        this.getNativeElements();
        this.setSelectedOptions();
    }

    setSelectedOptions() {
        let label: string;
        let index: number;
        this.selectedOptions = this.model.map((val: any) => {
            // We don't necessarily have the label for the option so if not,
            // we'll just use the value.
            index = this.plLodash.findIndex(this.modelLabelOptions, 'value', val);
            label = index > -1 ? this.modelLabelOptions[index].label : val;
            return { value: val, label: label, selected: true };
        });
    }

    onChangeFilter(obj: any) {
        this.search();
    }

    onFocusFilter(info: { focused: boolean; evt: any }) {
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
        this.focused = true;
        this.formClasses();

        if (this.multiSelectFocused !== null) {
            this.multiSelectFocused = true;
        }
    }

    onBlurFilter(info: { blurred: boolean; evt: any }) {
        this.unFocus();
    }

    optionsCount(): number {
        return this.options.length;
    }

    areResultsTruncated(): boolean {
        return this.resultsTotalCount !== null && this.resultsTotalCount > this.optionsCount();
    }

    unFocus(forceUnfocus = false) {
        if (forceUnfocus || !this.inputMultiSelect.nativeElement.contains(document.activeElement)) {
            this.focused = false;
            this.formClasses();
        }

        if (this.multiSelectFocused && !this.focused) {
            this.reValidateInputErrors();
        }
    }

    search() {
        if (this.onSearch) {
            if (this.searchTimeoutTrigger) {
                clearTimeout(this.searchTimeoutTrigger);
            }
            this.searchTimeoutTrigger = setTimeout(() => {
                if (this.lastSearchVal !== this.filterModel) {
                    this.lastSearchVal = this.filterModel;
                    this.onSearch.emit({ value: this.filterModel });
                }
            }, this.debounce);
        }
    }

    toggleOption(option: any) {
        const oldVal = this.model;
        const index = this.model.indexOf(option.value);
        if (!option.selected) {
            if (index > -1) {
                this.model.splice(index, 1);
            }
        } else if (index < 0) {
            this.model.push(option.value);
        }
        this.propagateChange(this.model);
        this.modelChange.emit(this.model);
        if (this.onChange) {
            this.onChange.emit({ model: this.model, oldVal: oldVal });
        }
        this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        // On changes is not firing.. (which is fine / good), so update here.
        // Update label & filtered / selected options.
        this.setSelectedText();
        this.setOptions();

        if (this.searchInputElement) {
            this.searchInputElement.focus();
        } else {
            this.inputMultiSelect.nativeElement.focus();
        }
    }

    onSearchInputPreviewKeyDown = (event: KeyboardEvent) => {
        // ignore up and down arrows, and space if we are mid scroll
        if (
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown' ||
            event.code === 'Enter' || event.code === 'NumPadEnter' ||
            (event.code === 'Space' && this.dropDownIndex > -1)
        ) {
            this.keyDown(event);

            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        this.setDropDownIndex(-1);
        return true;
    }

    keyDown(event: KeyboardEvent) {
        if (event.code === 'Tab' || event.code === 'Escape') {
            this.unFocus(true);
            this.setDropDownIndex(-1);
        }

        if (this.focused && event) {
            if ((event.code === 'Space' && this.dropDownIndex > -1) || event.code === 'Enter' || event.code === 'NumPadEnter') {
                this.toggleSelectedOption();
                this.setDropDownIndex(-1);
            } else {
                this.selectOptionInDropDown(event);
            }

            event.stopPropagation();
        }

        if (event.code === 'Enter' || event.code === 'NumPadEnter') {
            this.focused = !this.focused;
            this.formClasses();
        }
    }

    private reValidateInputErrors() {
        this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        this.multiSelectFocused = null; // Set to null for revalidation not to run more than once automatically.
    }

    private getNativeElements() {
        try {
            this.dropdownNativeElement = this.inputMultiSelect.nativeElement.getElementsByClassName('dropdown')[0];
            this.dropDownNativeOptions = this.inputMultiSelect.nativeElement.getElementsByClassName('option');
            this.optionMessages = this.inputMultiSelect.nativeElement.getElementsByClassName('options-messages');

            // TODO: find a cleaner way to get the child input
            this.searchInputElement =
                this.inputMultiSelect.nativeElement.getElementsByClassName('search-filter')[0].getElementsByTagName('input')[0];
        } catch {
            setTimeout(() => {
                this.getNativeElements();
            }, 10);
        }
    }

    // Helps to supports the keyboard navigation within the dropdown.
    private setDropDownIndex(index: number) {
        let indx = -1;
        if (index >= -1) {
            indx = index;
        }
        this.dropDownIndex = indx;
        this.highLightOptionInDropDown(indx);
    }

    private getFilterHeight() {
        return (this.optionMessages) ?
            this.optionMessages[0].offsetHeight + (48 * 2) : // TODO: calc this magic number
            0;
    }

    private scrollToOptionIndexInDropDown(optionIndex: number) {
        if (optionIndex >= 0 && optionIndex < this.dropDownNativeOptions.length) {
            const target = this.dropDownNativeOptions[optionIndex];
            this.dropdownNativeElement.scrollTo(0, target.offsetTop - this.getFilterHeight());
        } else {
            this.dropdownNativeElement.scrollTo(0, 0);
        }
    }

    private toggleSelectedOption() {
        const options = this.selectedOptions.concat(this.filteredOptions); // selected are on the top
        if (this.dropDownIndex > -1 && this.dropDownIndex < options.length) {
            const dropDownOption = options[this.dropDownIndex];
            dropDownOption.selected = !dropDownOption.selected;
            this.toggleOption(dropDownOption);

            this.dropDownNativeOptions[this.dropDownIndex].parentNode.scrollTo(0, 0);
        }
    }

    private selectOptionInDropDown(event: KeyboardEvent) {
        if (this.keyEventsMap[event.code]) {
            let dropDownIndx = this.dropDownIndex;

            dropDownIndx = dropDownIndx + (this.keyEventsMap[event.code]);
            if (dropDownIndx < 0) {
                dropDownIndx = 0;
            } else if (dropDownIndx >= this.dropDownNativeOptions.length) {
                dropDownIndx = this.dropDownNativeOptions.length - 1;
            }

            this.setDropDownIndex(dropDownIndx);
        }
    }

    private highLightOptionInDropDown(index: number) {
        if (this.dropDownNativeOptions) {
            if (this.dropDownNativeOptions) {
                for (let i = 0; i < this.dropDownNativeOptions.length; i++) {
                    this.setColorOfDropDownOption(i, '');
                }
            }
    
            this.setColorOfDropDownOption(index, 'aliceblue');
            this.scrollToOptionIndexInDropDown(index);
        }
    }

    private setColorOfDropDownOption(optionIndex: number, color: string) {
        if (optionIndex >= 0 && optionIndex < this.dropDownNativeOptions.length) {
            this.dropDownNativeOptions[optionIndex].style.backgroundColor = color;
        }
    }
}
