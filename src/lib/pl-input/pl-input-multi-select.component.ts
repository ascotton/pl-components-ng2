import {
    Component, SimpleChanges,
    Output, EventEmitter,
    ElementRef, ViewChild,
    forwardRef, AfterViewInit,
    Inject, Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-multi-select',
    templateUrl: './pl-input-multi-select.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-multi-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputMultiSelectComponent),
            multi: true,
        },
    ],
})
export class PLInputMultiSelectComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild('inputMultiSelect') inputMultiSelect: ElementRef;
    @ViewChild('selectButton') selectButton: ElementRef;

    @Output() readonly modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    @Input() model: string[] | any = [];
    @Input() options: any[] = [];
    @Input() placeholder = 'Choose options';
    @Input() filterPlaceholder = 'Type to filter..';
    @Input() filter: any;
    @Input() label = '';
    @Input() disabled = false;
    @Input() required = false;
    @Input() validationMessages: any = {};
    @Input() formCtrl: any;
    @Input() dropdownContainerSelector = 'body';
    @Input() forceChange = false; // Changes to the `model` (or any array in general) will NOT trigger ngOnChanges, so this can be used to force ngOnChanges to fire
    @Input() currentLabelOpts: {displayOpts: boolean, replaceWithBlank?: string} = {
        displayOpts: false, 
        replaceWithBlank: '',
    };

    name = '';
    classesContainer: any = {};
    formCtrlSet = false;
    formControl: any = null;
    filteredOptions: any[] = [];
    filterModel = '';
    currentLabel = '';
    focused = false;
    useFilter = false;
    selectedOptions: any[] = [];
    timeoutReFilter: any = null;
    inputErrorsRevalidated = false;

    private keyEventsMap: any; // The allowed keyboard events for dropdown.
    private dropDownIndex: number; // For keyboard navigation in dropdown
    private dropDownOptions: any[]; // Will hold the options selected and filtered.
    private dropDownNativeOptions: any[]; // Will hold the DOM options selected and filtered.
    private dropdownNativeElement: any;
    private searchInputElement: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
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

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }

    ngOnInit() {
        this.setFormCtrl();
        this.setDropDownIndex(-1);
        this.init();

        if (!this.currentLabelOpts) this.currentLabelOpts = { displayOpts: false, replaceWithBlank: '' };
    }

    ngAfterViewInit() {
        this.keyEventsMap = {
            ArrowUp: -1,
            ArrowDown: 1,
        };
        this.checkOrderOfDropDownOptions();
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
            'multiSelect',
            this.formControl,
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
    }

    init() {
        if (!this.model) {
            this.model = [];
        }

        if (this.filter || this.options) {
            this.formClasses();
            this.useFilter = this.filter ? this.filter : this.options.length > 15;
            this.setCurrentLabel();
            this.setFilteredAndSelectedOptions();   
        }
    }

    setCurrentLabel() {
        const modelLabel = this.getLabelFromModel();
        this.currentLabel = modelLabel ? modelLabel : this.placeholder;
    }

    clickButton() {
        if (!this.disabled) {
            this.toggleDropDown();

            if (this.focused && this.formControl) {
                this.formControl.markAsTouched();
            }
        }

        // Do not load errors until user opens the box, so that no error state is defaulted.
        this.reValidateInputErrors();
    }

    onChangeFilter(newVal: any) {
        try {
            // Protected against up, down, and space since these are used for keyboard navigation
            const validEvt = newVal && (
                newVal.evt.code !== 'ArrowUp' &&
                newVal.evt.code !== 'ArrowDown' &&
                newVal.evt.code !== 'Space'
            );
            if (validEvt) {
                this.setFilteredAndSelectedOptions(newVal);
            }
        } catch (error) {
            this.setFilteredAndSelectedOptions(newVal);
        }

    }

    setFilteredAndSelectedOptions(newVal?: any) {
        const searchText = this.filterModel.toLowerCase();
        let filtered = false;
        let selected = false;
        const filteredOpts: any[] = [];
        const selectedOpts: any[] = [];

        this.options.forEach((option: any) => {
            filtered = option.label.toString().toLowerCase().indexOf(searchText) > -1;
            selected = this.model.indexOf(option.value) > -1 ? true : false;
            if (selected) {
                selectedOpts.push(Object.assign({}, option, { selected: true }));
            } else if (filtered) {
                filteredOpts.push(Object.assign({}, option, { selected: false }));
            }
        });

        if (newVal && newVal.evt && newVal.evt.type === 'blur') {
            return;
        }
        this.selectedOptions = selectedOpts;
        this.filteredOptions = filteredOpts;
        this.checkOrderOfDropDownOptions();
    }

    getLabelFromModel() {
        if (this.currentLabelOpts && this.currentLabelOpts.displayOpts && this.model.length) {
            return this.model.map((model: string) => ` ${model.replace(this.currentLabelOpts.replaceWithBlank, '')}`);
        }
        return this.model.length ? `${this.model.length} selected` : '';
    }

    toggleOption(option: any) {
        const oldVal = this.model;
        let model = [...this.model];
        const index = this.model.indexOf(option.value);
        if (!option.selected) {
            if (index > -1) {
                model.splice(index, 1);
            }
        } else if (index < 0) {
            model.push(option.value);
        }
        this.model = model;
        this.propagateChange(this.model);
        this.modelChange.emit(this.model);
        if (this.onChange) {
            this.onChange.emit({ model: this.model, oldVal });
        }
        this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        // On changes is not firing.. (which is fine / good), so update here.
        // Update label & filtered / selected options.
        this.setCurrentLabel();

        if (this.searchInputElement) {
            this.searchInputElement.focus();
        } else {
            this.inputMultiSelect.nativeElement.focus();
        }

        // To avoid options jumping around, set a timeout.
        if (this.timeoutReFilter) {
            clearTimeout(this.timeoutReFilter);
        }
    }

    onBlurDropdown(info: { blurred: boolean; evt: any }) {
        if (info.blurred && !this.selectButton.nativeElement.contains(info.evt.target)) {
            this.toggleDropDown(true);
        }
    }

    onFocusout() {
        const thisElement = this.inputMultiSelect.nativeElement;

        setTimeout(() => {
            if (!this.plInputShared.containsFocus(thisElement, document.activeElement)) this.toggleDropDown(true);
        }, 0);
    }

    onSearchInputPreviewKeyDown = (event: KeyboardEvent) => {
        return this.keyDown(event);
    }

    keyDown(event: KeyboardEvent) {
        // show/hide options
        const alwaysHide = (event.code === 'Tab' || event.code === 'Escape');
        const alwaysShow = (!this.focused && event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'ArrowDown');

        if (alwaysHide || alwaysShow) {
            this.toggleDropDown(alwaysHide, alwaysShow);
        }

        // reset focus from search input
        if (event.code === 'Enter' || event.code === 'NumPadEnter' || event.code === 'Escape') {
            setTimeout(() => { this.inputMultiSelect.nativeElement.focus(); }, 1);
        }

        // toggle/select option
        if (
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown' ||
            (event.code === 'Space' && this.dropDownIndex > -1) ||
            (event.code === 'Enter' || event.code === 'NumPadEnter')
        ) {
            if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumPadEnter') {
                this.toggleSelectedOption();
                this.setDropDownIndex(-1);
            } else if (this.focused && event) {
                this.selectOptionInDropDown(this.keyEventsMap[event.code]);
            }

            if (event.code === 'Enter' || event.code === 'NumPadEnter') {
                this.toggleDropDown();
            }

            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        return true;
    }

    private getFilterHeight() {
        return (this.useFilter) ? (48 * 2) : 0; // TODO: calc this magic number
    }

    private toggleDropDown(forceClose = false, forceOpen = false) {
        if (!this.disabled) {
            if (forceOpen) {
                this.focused = true;
            } else if (forceClose) {
                this.focused = false;
            } else {
                this.focused = !this.focused;
            }

            this.formClasses();

            if (!this.focused) {
                this.setDropDownIndex(-1); // Reset dropdown index when dropdown closes.
            }
        }
    }

    private toggleSelectedOption() {
        if (this.dropDownIndex > -1 && this.dropDownIndex < this.dropDownOptions.length) {
            const isSelected = this.dropDownOptions[this.dropDownIndex].selected;
            this.dropDownOptions[this.dropDownIndex].selected = !isSelected;

            this.toggleOption(this.dropDownOptions[this.dropDownIndex]);
        }
    }

    private selectOptionInDropDown(adjustment: number) {
        let dropDownIndx = this.dropDownIndex;

        dropDownIndx = dropDownIndx + adjustment;
        if (dropDownIndx < 0) {
            dropDownIndx = 0;
        } else if (dropDownIndx >= this.dropDownNativeOptions.length) {
            dropDownIndx = this.dropDownNativeOptions.length - 1;
        }

        this.setDropDownIndex(dropDownIndx);
    }

    private highLightOptionInDropDown(index: number) {
        if (this.dropDownNativeOptions) {
            for (let i = 0; i < this.dropDownNativeOptions.length; i++) {
                this.setColorOfDropDownOption(i, '');
            }
        }

        this.setColorOfDropDownOption(index, 'aliceblue');
        this.scrollToOptionIndexInDropDown(index);
    }

    private scrollToOptionIndexInDropDown(optionIndex: number) {
        if (this.dropdownNativeElement) {
            if (optionIndex >= 0 && optionIndex < this.dropDownNativeOptions.length) {
                const target = this.dropDownNativeOptions[optionIndex];
                this.dropdownNativeElement.scrollTo(0, target.offsetTop - this.getFilterHeight() + 1);
            } else {
                this.dropdownNativeElement.scrollTo(0, 0);
            }
        }
    }

    private setColorOfDropDownOption(optionIndex: number, color: string) {
        if (optionIndex >= 0 && optionIndex < this.dropDownNativeOptions.length) {
            this.dropDownNativeOptions[optionIndex].style.backgroundColor = color;
        }
    }

    private getNativeOptions() {
        try {
            this.dropdownNativeElement = this.inputMultiSelect.nativeElement.getElementsByClassName('dropdown')[0];
            this.dropDownNativeOptions = this.inputMultiSelect.nativeElement.getElementsByClassName('option');

            // TODO: find a cleaner way to get the child input
            this.searchInputElement =
                this.inputMultiSelect.nativeElement.getElementsByClassName('search-filter')[0].getElementsByTagName('input')[0];
        } catch {
            setTimeout(() => {
                this.getNativeOptions();
            }, 10);
        }
    }

    // Behavior encapsulated due to dropdown options constantly changing due to filter.
    private checkOrderOfDropDownOptions() {
        this.dropDownOptions = this.selectedOptions.concat(this.filteredOptions);
        this.getNativeOptions();
    }

    // Helps to supports the keyboard navigation within the dropdown.
    private setDropDownIndex(index: number) {
        let indx = -1;
        if (index >= -1) {
            indx = index;
        }
        this.dropDownIndex = indx;
        this.highLightOptionInDropDown(indx);
        setTimeout(() => { this.highLightOptionInDropDown(indx); }, 1);
    }

    private reValidateInputErrors() {
        if (!this.inputErrorsRevalidated) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());

            this.inputErrorsRevalidated = true;
        }
    }
}
