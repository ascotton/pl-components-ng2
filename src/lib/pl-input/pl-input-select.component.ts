import {
    Component,
    SimpleChanges,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    forwardRef,
    Input,
    ViewEncapsulation,
    Inject,
    AfterViewInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// TODO - AOT needs `import lunr from 'lunr'` instead
import * as lunr from 'lunr';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';
import { Option } from '../common/interfaces';

@Component({
    selector: 'pl-input-select',
    templateUrl: './pl-input-select.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputSelectComponent),
            multi: true,
        },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class PLInputSelectComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild('inputSelect') element: ElementRef;

    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    @Input('model') model: any = '';

    @Input('dropdownContainerSelector') dropdownContainerSelector: string = 'body';

    @Input('options') options: any[] = [];

    @Input('placeholder') placeholder: string = 'Select an item';

    @Input('filterPlaceholder') filterPlaceholder: string = 'Type to filter..';

    // Used to detect changes.
    private lastFilterModel: string = '';
    currentLabel: string = '';
    focused: boolean = false;
    useFilter: boolean = false;
    useBigFilter: boolean = false;

    @Input('filter') filter: any;

    @Input('label') label: string = '';

    @Input('required') required: boolean = false;

    @Input('disabled') disabled: boolean = false;

    @Input('blurOnSelect') blurOnSelect: boolean = false;

    @Input('validationMessages') validationMessages: any = {};

    @Input('formCtrl') formCtrl: any;

    @Input('emptyOption') emptyOption: boolean = false;

    @Input('styleInline') styleInline: boolean = false;

    @Input('iconFillClass') iconFillClass: string = '';

    @Input('iconScale') iconScale: number = 0.6;

    @Input('iconVerticalAlign') iconVerticalAlign: string = '-6px';

    @Input('placeholderColor') placeholderColor: string = '';

    @Input('dropdownMinWidth') dropdownMinWidth: number = 0;

    @Input('dropdownMaxHeight') dropdownMaxHeight: number = 300;

    @Input('sortByLabel') sortByLabel: boolean = false;

    // if bigFilter is true, use lunr.js search to index and search items
    @Input('bigFilter') bigFilter: any;

    // when using bigFilter, specify the maximum number of results to display
    @Input('bigFilterDisplayLimit') bigFilterDisplayLimit: number = 20;

    @Input('highlightSelected') highlightSelected: boolean = false;

    // remove lunr stemming for lossless searches
    @Input('lunrNoStemming') lunrNoStemming = false;
    // use startsWith matching '^searchExpression*' for better performance
    @Input('lunrStartsWithMatch') lunrStartsWithMatch = false;

    @Input('ignoreDeactivateScroll') ignoreDeactivateScroll = false;

    @Input('clearSelectFilter') clearSelectFilter = false;

    @Input() dropUp = false; // For displaying the options above and not below; drop-up instead of drop-down

    @Input() reverseOptionSort = false;
    @Input() scrollToOptionByLabel: string | number;
    @Input() scrollToOptionByValue: string | number;

    truncatedResults = 0;
    lunrIndexing = false;
    classesContainer: any = {};
    classesIcon: any = {
        customFill: false,
    };
    stylesLabel: any = {};
    formControl: any = null;
    filteredOptions: any[] = [];

    private ESCAPE = 'escape';
    private lunrIndex: any;
    private name = '';
    private formCtrlSet = false;
    filterModel = '';
    private optionsIndex = -1; // For keyboard navigation in dropdown
    private optionsNativeElements: any[];
    private dropdownNativeElement: any;
    private keyEventsMap: any;
    private lastKeyWasArrow = false;

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
        if (localStorage.getItem('PL_DEBUG_SELECT_CHANGES')) {
            console.log('--- pl-input-select ngOnChanges', { changes, STATE: this });
        }

        this.init(changes.options != null);

        if (this.clearSelectFilter) {
            this.filterModel = '';
            this.onChangeFilter();
        }
    }

    ngOnInit() {
        this.setFormCtrl();
        this.init(true);
    }

    ngAfterViewInit() {
        this.getNativeElements();
        this.keyEventsMap = {
            Escape: this.ESCAPE,
            ArrowUp: -1,
            ArrowDown: 1,
        };
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

    init(reindex: boolean) {
        this.useBigFilter = this.bigFilter !== undefined ? this.bigFilter : false;
        
        if (this.options) {
            this.useFilter = this.filter !== undefined ? this.filter : this.options.length > 15;
        }

        if (this.useBigFilter && reindex) {
            this.indexItems();
        }

        this.setCurrentLabel();
        if (this.options) this.filterOptions();

        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();

        if (this.iconFillClass) {
            this.classesIcon[this.iconFillClass] = true;
            this.classesIcon.customFill = true;
        } else {
            this.classesIcon.customFill = false;
        }

        if (this.placeholderColor) {
            this.stylesLabel.color = this.placeholderColor;
        }
    }

    indexItems() {
        this.lunrIndexing = true;
        const startTime = new Date().getTime();
        const options = this.options;
        const that = this;
        this.lunrIndex = lunr(function () {
            this.field('label');
            this.ref('index');

            // with the lunr stemmer, the index is lossy
            // and removing it makes the inverted index larger but not lossy
            // see Stemming: https://lunrjs.com/guides/core_concepts.html

            // if (that.lunrNoStemming) {
            this.pipeline.remove(lunr.stemmer)
            // }
            // ^^ making this the default behavior. cleanup the commented out lines later.


            options.forEach((option, index) => {
                option.index = index;
                this.add(option);
                if (index === options.length - 1) {
                    that.lunrIndexing = false;
                }
            });
        });

    }

    formClasses() {
        const classes1: any = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'select',
            this.formControl,
        );
        classes1.styleInline = this.styleInline;
        this.classesContainer = classes1;
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
    }

    setCurrentLabel() {
        this.currentLabel = this.model ? this.getLabelFromModel() : this.placeholder;
    }

    clickButton() {
        this.toggleDropDown();
    }

    onChangeFilter() {
        if (this.lastFilterModel !== this.filterModel) {
            this.filterOptions();
            this.setDropDownIndex(-1);
        }
    }

    // @param intervals - an array of 2 item arrays, where the 2 item arrays are beginning and end of an interval
    // @return - array of inte with overlapping intevals merged
    mergeIntervals(intervals: any[][]) {
        if (intervals.length <= 0) {
            return intervals;
        }

        const stack = [];
        let last;

        // sort the intervals based on start
        intervals.sort(function (a: number[], b: number[]) {
            return a[0] - b[0];
        });

        // push the first interval to stack
        stack.push(intervals[0]);

        // Start from the next interval and merge if necessary
        for (let i = 1, len = intervals.length; i < len; i++) {
            // get interval from last item
            last = stack[stack.length - 1];

            // if current interval is not overlapping with stack top, push it to the stack
            // Otherwise update the ending time of top if ending of current interval is more
            if (last[1] <= intervals[i][0]) {
                stack.push(intervals[i]);
            } else if (last[1] < intervals[i][1]) {
                last[1] = intervals[i][1];
                stack.pop();
                stack.push(last);
            }
        }
        return stack;
    }

    // find instances of the word to be highlighted in the label and surround with strong tags. This was originally
    // just a couple of lines until I had to accomodate overlapping hits
    highlightSubstrings(label: string, terms: string[]) {
        const intervals: any[][] = [];

        // first compute all substring intervals of the label corresponding to each instance of each search term
        for (const word of terms) {
            const regex = new RegExp(word, 'ig');
            let result;
            while ((result = regex.exec(label))) {
                const interval = [result.index, result.index + word.length];
                intervals.push(interval);
            }
        }
        // if no intervals, then just return the label as is. this should never happen.
        if (intervals.length === 0) {
            return label;
        } else {
            // merge overlapping intervals
            const mergedIntervals = this.mergeIntervals(intervals.slice(0));

            // construct a new label, substring by substring, highlighting the intervals with <strong> tags
            let boldedLabel = label.substring(0, mergedIntervals[0][0]);
            for (let i = 0; i < mergedIntervals.length; i++) {
                const interval = mergedIntervals[i];
                boldedLabel += `<strong>${label.substring(interval[0], interval[1])}</strong>`;

                // if there is another interval coming, append unbolded text to the beginning of the next interval
                // otherwise, just go to the end.
                if (i < mergedIntervals.length - 1) {
                    boldedLabel += label.substring(interval[1], mergedIntervals[i + 1][0]);
                } else {
                    boldedLabel += label.substring(interval[1]);
                }
            }

            return boldedLabel;
        }
    }

    filterOptions() {
        this.lastFilterModel = this.filterModel;
        const searchText = this.filterModel.toLowerCase();
        let opts: any[] = [];
        // Add empty option.
        if (this.emptyOption) {
            opts.push({ value: '', label: '-' });
        }
        let curOpt: any;
        if (this.options && this.options.length) {
            if (this.bigFilter) {
                if (searchText.length === 0) {
                    // In the absence of a search string, just use the first items, up to bigFilterDisplayLimit
                    if (this.sortByLabel) {
                        this.labelSort(this.options);
                    }
                    opts = [...opts, ...this.options.slice(0, this.bigFilterDisplayLimit)];
                    this.truncatedResults = this.options.length > this.bigFilterDisplayLimit ? this.options.length : 0;
                } else {
                    // Otherwise, do the search, but still truncate at bigFilterDisplayLimit
                    this.truncatedResults = 0;
                    // split the search text on spaces, trim each, filter out empty strings
                    const searchWords: string[] = searchText.split(' ').map(word => word.trim()).filter(word => word.length);
                    // for lunr search, wildcard before and after each search term in order to get partial string hits
                    const wideSearch = this.lunrStartsWithMatch ? '' : '*';
                    const wildcardSearchText = searchWords
                        .map(word => word.length ? `${wideSearch}${word}*` : '').join(' ');
                    const results = this.lunrIndex.search(wildcardSearchText);
                    if (localStorage.getItem('PL_DEBUG_LUNR')) {
                        console.log('---lunr', { searchText, searchWords, wildcardSearchText, results, lunrIndex: this.lunrIndex })
                    }

                    // make copies of each option corresponding to the results, since we will modify their labels
                    for (let i = 0; i < results.length; i++) {
                        const idx = results[i].ref;
                        opts.push(Object.assign({}, this.options[idx]));
                    }

                    // truncate to bigFilterDisplayLimit
                    if (results.length > this.bigFilterDisplayLimit) {
                        this.truncatedResults = results.length;
                        opts = opts.slice(0, this.bigFilterDisplayLimit);
                    }

                    // highlight all search hits in the result labels
                    opts = opts.map((opt) => {
                        let label = opt.label.slice(0);
                        label = this.highlightSubstrings(label, searchWords);
                        return Object.assign(opt, { label: label });
                    });
                }
            } else {
                this.options.filter((option: any) => {
                    if (option.label.toString().toLowerCase().indexOf(searchText) > -1) {
                        curOpt = Object.assign({}, option, {
                            classes: {
                                disabled: option.disabled,
                            },
                        });
                        opts.push(curOpt);
                    }
                });
                if (this.sortByLabel) {
                    this.labelSort(opts);
                }
                if (this.reverseOptionSort) {
                    opts.reverse();
                }
            }
        }

        this.filteredOptions = opts;
        this.getNativeElements();
    }

    labelSort(list: Option[]) {
        list.sort((a: Option, b: Option) => a.label.localeCompare(b.label));
    }

    getLabelFromModel() {
        let option: any;
        if (this.model) {
            for (let ii = 0; ii < this.options.length; ii++) {
                option = this.options[ii];
                if (option.value === this.model) {
                    return option.label;
                }
            }
        }
        return this.placeholder;
    }

    private markAsTouched() {
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
    }

    selectOption(option: any, event: any) {
        if (localStorage.getItem('PL_DEBUG_SELECT')) {
            console.log('--- pl-input-select select', { option, event })
        }
        if (option && (option.disabled === undefined || !option.disabled)) {
            const oldVal = this.model;
            const model = option.value;

            this.markAsTouched();
            this.propagateChange(model);
            this.modelChange.emit(model);

            if (this.onChange) {
                this.onChange.emit({ model: model, oldVal: oldVal });
            }
            if (event && event.type === 'click') {
                this.focused = false;
            }
            if (this.blurOnSelect) {
                this.element.nativeElement.blur();
            }

            this.setDropDownIndex(-1);
            this.formClasses();
            this.plInputErrors.reValidate(model, this.formControl, this.getValidations());
        }
    }

    onFocusout() {
        const thisElement = this.element.nativeElement;

        setTimeout(() => {
            // document.activeElement is not set until after focusout event bubbles
            if (!this.plInputShared.containsFocus(thisElement, document.activeElement)) {
                this.closeDropDown();
            }
        }, 0);
    }

    onSearchInputPreviewKeyDown = (event: KeyboardEvent) => {
        // ignore up and down arrows, and space if we are mid scroll
        if (
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown' ||
            (event.code === 'Space' && this.optionsIndex > -1) ||
            (event.code === 'Enter' && this.optionsIndex > -1)
        ) {
            this.keyDown(event);

            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        this.optionsIndex = -1;
        this.highLightOptionInDropDown(-1);
        return true;
    }

    keyDown(event: KeyboardEvent) {
        if (event) {
            if (this.focused && (event.code === 'Space' || event.code === 'Enter')) {
                this.selectOption(this.filteredOptions[this.optionsIndex], event);
            }

            if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
                if (!this.focused) {
                    this.toggleDropDown(true);
                } else {
                    this.selectElementInDropDown(event);
                }
                event.stopPropagation();
                event.preventDefault();
            }

            if (event.code === 'Enter' || (this.lastKeyWasArrow && event.code === 'Space') || (!this.focused && event.code === 'Space')) {
                this.toggleDropDown();
                this.element.nativeElement.focus();
            }
            if (event.code === 'Escape' || event.code === 'Tab') {
                this.closeDropDown();
            }

            this.lastKeyWasArrow = (event.code === 'ArrowUp' || event.code === 'ArrowDown');
        }
    }

    private getFilterHeight() {
        return (this.useFilter) ? (48 * 2) : 0; // TODO: calc this magic number
    }

    private toggleDropDown(forceOpen = false) {
        if (!this.disabled) {
            this.focused = forceOpen || !this.focused;
            this.formClasses();

            // Scrolls automatically to an option displayed in the select box when any of these is defined
            if (this.scrollToOptionByLabel || this.scrollToOptionByValue) {
                const optionProperty = this.scrollToOptionByLabel ? this.scrollToOptionByLabel : 'value';
                this.scrollToSpecificOption([...this.options], optionProperty);
            } else {
                // find and set the selected item
                let index = -1;
                for (let i = 0; i < this.filteredOptions.length; i++) {
                    if (this.filteredOptions[i].value === this.model) {
                        index = i;
                        break;
                    }
                }
                setTimeout(() => {
                    this.setDropDownIndex(index);
                }, 0);
            }
        }
    }

    /**
     * Scrolls automatically to an option displayed in the select box
     * this.scrollToOptionByLabel or this.scrollToOptionByValue have to be defined
     *
     * @param selectOptions The array of options displayed in the select box
     * @param optionProperty The name of the prop we want to use for searching our option
     */
    private scrollToSpecificOption(selectOptions: Option[], optionProperty: string | number) {
        const options = this.reverseOptionSort ? selectOptions.reverse() : selectOptions;
        const optionToScroll = this.scrollToOptionByLabel ? this.scrollToOptionByLabel : this.scrollToOptionByValue;

        const optionToScrollIndex = options.findIndex((option: Option) => {
            return option[optionProperty] === optionToScroll;
        });

        if (optionToScrollIndex >= 0) {
            setTimeout(() => {
                this.setDropDownIndex(optionToScrollIndex);
            }, 0);
        }
    }

    private closeDropDown() {
        this.focused = false;
        this.lastKeyWasArrow = false;
        this.markAsTouched();
        this.formClasses();
    }

    private getNativeElements() {
        try {
            this.dropdownNativeElement = this.element.nativeElement.getElementsByClassName('dropdown')[0];
            this.optionsNativeElements = this.element.nativeElement.getElementsByClassName('option');
        } catch {
            setTimeout(() => {
                this.getNativeElements();
            }, 10);
        }
    }

    private scrollToOptionIndexInDropDown(optionIndex: number) {
        if (this.dropdownNativeElement) {
            if (optionIndex >= 0 && optionIndex < this.optionsNativeElements.length) {
                const target = this.optionsNativeElements[optionIndex];
                this.dropdownNativeElement.scrollTo(0, target.offsetTop - this.getFilterHeight() + 1);
            } else {
                this.dropdownNativeElement.scrollTo(0, 0);
            }
        }
    }

    private setColorOfDropDownOption(optionIndex: number, color: string) {
        if (optionIndex >= 0 && optionIndex < this.optionsNativeElements.length) {
            this.optionsNativeElements[optionIndex].style.backgroundColor = color;
        }
    }

    private highLightOptionInDropDown(index: number) {
        if (this.optionsNativeElements) {
            for (let i = 0; i < this.optionsNativeElements.length; i++) {
                this.setColorOfDropDownOption(i, '');
            }
        }

        this.setColorOfDropDownOption(index, 'aliceblue');
        this.scrollToOptionIndexInDropDown(index);
    }

    private selectElementInDropDown(event: KeyboardEvent) {
        if (event && this.keyEventsMap[event.code]) {
            let dropDownIndx = this.optionsIndex;

            // Navigate through options using keys
            dropDownIndx = dropDownIndx + (this.keyEventsMap[event.code]);
            if (dropDownIndx < 0) {
                dropDownIndx = 0;
            } else if (dropDownIndx >= this.optionsNativeElements.length) {
                dropDownIndx = this.optionsNativeElements.length - 1;
            }

            this.setDropDownIndex(dropDownIndx);
        }
    }

    // Helps to supports the keyboard navigation within the dropdown.
    private setDropDownIndex(index: number) {
        let indx = -1;
        if (index >= -1) {
            indx = index;
        }
        this.optionsIndex = indx;
        this.highLightOptionInDropDown(indx);
    }
}
