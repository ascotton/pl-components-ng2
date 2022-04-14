import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
    selector: 'inputs-demo',
    templateUrl: './inputs-demo.component.html',
    styleUrls: ['./inputs-demo.component.less'],
})
export class InputsDemoComponent implements OnInit  {
    inputsDemoForm: FormGroup = new FormGroup({});

    selectOpts: any = [];
    selectLoading = false;
    selectOptsBig: any = [];
    selectOptsSearch: any = [];
    multiSelectLoading = false;
    multiSelectOptsSearch: any = [];
    yearToScrollInDatePicker = null;
    reverseYearsSortInDatePicker = false;
    existingFile: any = { name: 'existing1.jpg' };
    multiSelectApiModelOpts: any[] = [{ value: 'three', label: 'Three' }];
    multiSelectOptsSearchTruncated: any[] = this.multiSelectOptsSearch;
    multiSelectOptsSearchResultsTotalsCount: number = this.multiSelectOptsSearchTruncated.length;
    existingFilesMultiple: any[] = [{ name: 'existing2.pdf' }, { name: 'existing3.pdf' }];

    models: any = {
        disabled: false,
        textDefault: 'text default',
        textIcon: 'text icon',
        number: 45,
        email: 'valid@email.c',
        url: 'http://google.com',
        pattern1: '0612345678',
        pattern2: 'Mike Jones',
        textarea: 'textarea here',
        selectDefault: 'one',
        selectFilter: 'two',
        selectApi: 'three',
        // specificYear: moment().year(),
        multiSelectDefault: ['one'],
        multiSelectFilter: ['two', 'four'],
        multiSelectApi: ['three', 'five'],
        multiSelectApiTruncated: ['four', 'six'],
        checkbox: true,
        colors: ['blue'],
        size: 'medium',
        currentDate: moment().format('YYYY-MM-DD'),
        datepicker: '2016-12-04',
        datepickerSmallWidth: 'Nov 15, 2016',
        time: '16:34',
        time2: '3:05p',
        time3: '00:00',
        time4: '12:00',
        radio2: false,
        radio3: 0,
        datePicker: [],
    };

    optionsColors = [
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'red', label: 'Red' },
    ];

    optionsSizes = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
    ];

    optionsBooleans = [{ value: false, label: 'False' }, { value: true, label: 'True' }];

    optionsDatePicker = [
        { value: 'reversedYear', label: 'Reverse Year Sort' },
        { value: 'autoScrollYear', label: 'Scroll to Current Year' },
    ];

    validationMessagesPattern1: any = {
        pattern: 'Enter 06 then 8 digits',
    };

    modelsNoForm: any = {};

    constructor() { }

    ngOnInit() {
        this.selectOpts = this.formSelectOpts();
        this.selectOptsBig = this.formSelectOptsBig();
    }

    formSelectOpts() {
        return [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' },
            { value: 'four', label: 'Four' },
            { value: 'five', label: 'Five' },
            { value: 'six', label: 'Six' },
            { value: 'seven', label: 'Seven' },
            { value: 'eight', label: 'Eight' },
            { value: 'nine', label: 'Nine' },
            { value: 'ten', label: 'Ten' },
        ];
    }

    formSelectOptsBig() {
        let opts = [];
        let parts = [
            'one',
            'two',
            'three',
            'alpha',
            'beta',
            'gamma',
            'foo',
            'baz',
            'bar',
            'red',
            'white',
            'blue',
            'dog',
            'cat',
            'mouse',
        ];
        for (let i = 0; i < 1000; i++) {
            let nextParts = [];
            for (let j = 0; j < 3; j++) {
                nextParts.push(parts[Math.floor(parts.length * Math.random())]);
            }
            let nextWord = nextParts.join(' ');
            opts.push({ value: nextWord, label: nextWord });
        }
        return opts;
    }

    onChange(info: { model: any; evt: any }) {
        console.log('inputs-demo change: ', info.model);
    }

    onChangeDatePickerFeature() {
        this.yearToScrollInDatePicker = this.models.datePicker.includes('autoScrollYear') ? moment().year().toString()
         : null;
        this.reverseYearsSortInDatePicker = this.models.datePicker.includes('reversedYear');
    }

    onSearchSelect(evt: { value: string }) {
        this.selectLoading = true;
        const search = evt.value.toLowerCase();
        setTimeout(() => {
            if (!search) {
                // this.selectOptsSearch = [];
                this.selectOptsSearch = this.formSelectOpts();
            } else {
                this.selectOptsSearch = this.formSelectOpts().filter((opt: any) => {
                    return opt.value.toLowerCase().indexOf(search) > -1 ? true : false;
                });
            }
            this.selectLoading = false;
        }, 500);
    }

    onSearchMultiSelect(evt: { value: string }) {
        this.multiSelectLoading = true;
        const search = evt.value.toLowerCase();
        setTimeout(() => {
            this.multiSelectOptsSearch = this.formSelectOpts().filter((opt: any) => {
                return opt.value.toLowerCase().indexOf(search) > -1;
            });

            this.multiSelectOptsSearchResultsTotalsCount = this.multiSelectOptsSearch.length;
            this.multiSelectOptsSearchTruncated = this.multiSelectOptsSearch.slice(0, 5);

            this.multiSelectLoading = false;
        }, 500);
    }

    submit(form: any) {
        console.log('submit form: ', form.valid, form.value);
    }
}
