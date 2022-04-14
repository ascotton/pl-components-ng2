import { Component, Output, EventEmitter, Input } from '@angular/core';

import * as moment from 'moment';

import { PLMiniCalendarService } from './pl-mini-calendar.service';

@Component({
    selector: 'pl-mini-calendar',
    templateUrl: './pl-mini-calendar.component.html',
    styleUrls: ['./pl-mini-calendar.component.less'],
    inputs: [
        'model',
        'format',
        'firstDayOfWeek',
        'minDate',
        'maxDate',
        'selectedRange',
        'todayRange',
        'monthOptsFormat',
    ],
})
export class PLMiniCalendarComponent {
    // tslint:disable-next-line: no-input-rename
    @Input('reverseYearSort') reverseYearSort: boolean;
    // tslint:disable-next-line: no-input-rename
    @Input('scrollToYearByLabel') scrollToYearByLabel: string | number;
    // tslint:disable-next-line: no-input-rename
    @Input('scrollToYearByValue') scrollToYearByValue: string | number;

    @Output() readonly modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();

    model: string = '';
    format: string = 'YYYY-MM-DD';
    firstDayOfWeek: number = 0;
    minDate: string = '';
    maxDate: string = '';
    // `month`, `week` or `day`. Will highlight the day(s) around the current (model) value.
    selectedRange: string = 'day';
    // `month`, `week` or `day`. Will highlight the day(s) around today.
    todayRange: string = 'month';
    // 'MMM' for 3 letter abbreviation or 'MMMM' for full month name.
    monthOptsFormat: string = 'MMM';

    calendarKeyDownEventCode: string;

    // An array of arrays for rows and columns. Each cell is an object of: 'date', 'day', 'classes'.
    daysTable: any = [];
    daysInWeek: number = 7;

    modelInternal: string = '';
    // Keep the same format here, just output in desired format.
    formatInternal = 'YYYY-MM-DD';

    viewDate: string = '';
    viewMonth: string = '';
    viewYear: string = '';
    viewDay: string = '';
    startViewDate: string = '';
    endViewDate: string = '';
    selectedRangeStartDate: string = '';
    selectedRangeEndDate: string = '';
    todayRangeStartDate: string = '';
    todayRangeEndDate: string = '';
    weekdaysHeader: string[] = [];
    monthOpts: any[] = [];

    yearOpts: any[] = [];
    // optionToScrollByLabel = null;
    // optionToScrollByValue = null;

    minYear: number = -1;
    maxYear: number = -1;

    constructor(private plMiniCalendar: PLMiniCalendarService) {}

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: any) {
        this.init();
    }

    init() {
        this.setDefaults();
        if (
            this.model === undefined ||
            !this.model ||
            typeof this.model !== 'string' ||
            !moment(this.model, this.format, true).isValid()
        ) {
            this.modelInternal = moment().format(this.formatInternal);
        } else {
            this.modelInternal = moment(this.model, this.format).format(this.formatInternal);
        }
        this.setDate(this.modelInternal, false, false);
        this.setMinAndMaxDate();
        this.setMonthOpts();
        this.setYearOpts();
        this.setWeekdaysHeader();
        this.formDaysTable();
    }

    /**
     * Helper for calendarFocusOut()
     */
    calendarKeyDown(event: any) {
        this.calendarKeyDownEventCode = event.code;
    }

    /**
     * Emits an event for the parent to close the calendar when the condition meets
     * Resets the key press when condition is not met or an error happens.
     */
    calendarFocusOut(event: any) {
        try {
            if (
                this.calendarKeyDownEventCode === 'Tab' && 
                event.srcElement.parentElement.className === 'year-select'
            ) {
                this.onChange.emit({ closeMiniCalendar: true });
            };

            this.calendarKeyDownEventCode = null;
        } catch (error) {
            this.calendarKeyDownEventCode = null;
        }
    }

    setDefaults() {
        if (!this.format) {
            this.format = 'YYYY-MM-DD';
        }
        if (this.firstDayOfWeek === undefined) {
            this.firstDayOfWeek = 0;
        }
        if (!this.selectedRange) {
            this.selectedRange = 'day';
        }
        if (!this.todayRange) {
            this.todayRange = 'month';
        }
        if (!this.monthOptsFormat) {
            this.monthOptsFormat = 'MMM';
        }
    }

    setMinAndMaxDate() {
        const bufferYears = 25;
        const dateMoment = moment(this.modelInternal, this.formatInternal);
        const month = this.numberToTwoDigits(this.momentMonthToMonth(dateMoment.month()));
        let year: any;
        if (!this.minDate) {
            year = this.numberToTwoDigits(dateMoment.clone().subtract(bufferYears, 'years').year());
            this.minDate = `${year}-${month}-01`;
        }
        if (!this.maxDate) {
            year = this.numberToTwoDigits(dateMoment.clone().add(bufferYears, 'years').year());
            const daysInMonth = this.numberToTwoDigits(moment(`${year}-${month}`, 'YYYY-MM').daysInMonth());
            this.maxDate = `${year}-${month}-${daysInMonth}`;
        }
        this.minYear = moment(this.minDate, this.formatInternal).year();
        this.maxYear = moment(this.maxDate, this.formatInternal).year();
    }

    setWeekdaysHeader() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const offset = this.firstDayOfWeek;
        const headers: string[] = [];
        let weekdaysIndex: number;
        weekdays.forEach((weekday: string, index: number) => {
            weekdaysIndex = index + offset < weekdays.length ? index + offset : index + offset - weekdays.length;
            headers.push(weekdays[weekdaysIndex]);
        });
        this.weekdaysHeader = headers;
    }

    setMonthOpts() {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const opts: any[] = [];
        months.forEach((month: string, index: number) => {
            opts.push({
                // Add 1 so January is 1 instead of 0. And convert to string for select.
                value: (index + 1).toString(),
                label: this.monthOptsFormat === 'MMM' ? month.slice(0, 3) : month,
            });
        });
        this.monthOpts = opts;
    }

    setYearOpts() {
        const opts: any[] = [];
        for (let ii = this.minYear; ii <= this.maxYear; ii++) {
            opts.push({
                value: ii.toString(),
                label: ii,
            });
        }
        this.yearOpts = opts;
    }

    momentMonthToMonth(month: any) {
        // Moment month is 0 to 11, so add 1.
        return parseInt(month, 10) + 1;
    }

    setDate(date: string, formTable: boolean = true, validate: boolean = true) {
        if (!validate || this.isValidDate(date)) {
            this.viewDate = date;
            this.setViewDates();
            if (formTable) {
                this.formDaysTable();
            }
        }
    }

    setViewDates() {
        const dateMoment = moment(this.viewDate, this.formatInternal);
        this.viewMonth = this.momentMonthToMonth(dateMoment.month()).toString();
        this.viewYear = dateMoment.year().toString();
        this.viewDay = dateMoment.date().toString();
        this.setStartAndEndViewDates();
        let vals = this.getDateRange(this.modelInternal, this.selectedRange);
        this.selectedRangeStartDate = vals.start;
        this.selectedRangeEndDate = vals.end;
        vals = this.getDateRange(moment().format(this.formatInternal), this.todayRange);
        this.todayRangeStartDate = vals.start;
        this.todayRangeEndDate = vals.end;
    }

    numberToTwoDigits(number1: any) {
        let number = typeof number1 === 'string' ? number1 : number1.toString();
        if (number.length === 1) {
            number = `0${number}`;
        }
        return number;
    }

    getDateRange(date: string, range: string) {
        const dateMoment = moment(date, this.formatInternal);
        const vals: any = {};
        if (range === 'month') {
            const year = dateMoment.format('YYYY');
            const month = dateMoment.format('MM');
            let daysInMonth = this.numberToTwoDigits(dateMoment.daysInMonth());
            vals.start = `${year}-${month}-01`;
            vals.end = `${year}-${month}-${daysInMonth}`;
        } else if (range === 'week') {
            const dayOfWeek = dateMoment.day();
            let startOffset = dayOfWeek - this.firstDayOfWeek;
            if (startOffset < 0) {
                startOffset += this.daysInWeek;
            }
            const maxWeekday = 6;
            const lastDayOfWeek = this.firstDayOfWeek === 0 ? maxWeekday : this.firstDayOfWeek - 1;
            let endOffset = lastDayOfWeek - dayOfWeek;
            if (endOffset < 0) {
                endOffset += this.daysInWeek;
            }
            vals.start = dateMoment.clone().subtract(startOffset, 'days').format(this.formatInternal);
            vals.end = dateMoment.clone().add(endOffset, 'days').format(this.formatInternal);
        } else if (range === 'day') {
            vals.start = this.modelInternal;
            vals.end = this.modelInternal;
        }
        return vals;
    }

    setStartAndEndViewDates() {
        const dateMoment = moment(this.viewDate, this.formatInternal);
        const year = dateMoment.format('YYYY');
        const month = this.numberToTwoDigits(this.momentMonthToMonth(dateMoment.month()));

        const startMonthDate = `${year}-${month}-01`;
        const startMonthDateMoment = moment(startMonthDate, this.formatInternal);
        const dayOfWeekStart = startMonthDateMoment.day();
        let startOffset = dayOfWeekStart - this.firstDayOfWeek;
        if (startOffset < 0) {
            startOffset += this.daysInWeek;
        }
        this.startViewDate = startMonthDateMoment.clone().subtract(startOffset, 'days').format(this.formatInternal);

        const maxWeekday = 6;
        const lastDayOfWeek = this.firstDayOfWeek === 0 ? maxWeekday : this.firstDayOfWeek - 1;
        const daysInMonth = this.numberToTwoDigits(dateMoment.daysInMonth());
        const endMonthDate = `${year}-${month}-${daysInMonth}`;
        const endMonthDateMoment = moment(endMonthDate, this.formatInternal);
        const dayOfWeekEnd = endMonthDateMoment.day();
        let endOffset = lastDayOfWeek - dayOfWeekEnd;
        if (endOffset < 0) {
            endOffset += this.daysInWeek;
        }
        this.endViewDate = endMonthDateMoment.clone().add(endOffset, 'days').format(this.formatInternal);
    }

    formDaysTable() {
        let counter = 0;
        let currentDate = this.startViewDate;
        let currentDateMoment: any;
        let row = 0;
        let dayObj: any;
        const daysTable: any[] = [];
        while (currentDate <= this.endViewDate) {
            if (!daysTable[row]) {
                daysTable[row] = [];
            }

            currentDateMoment = moment(currentDate, this.formatInternal);
            dayObj = {
                date: currentDate,
                day: currentDateMoment.date(),
                classes: this.setDateClasses(currentDate),
                disabled: currentDate < this.minDate || currentDate > this.maxDate ? true : false,
            };
            daysTable[row].push(dayObj);

            counter++;
            currentDate = currentDateMoment.clone().add(1, 'days').format(this.formatInternal);
            if (counter % this.daysInWeek === 0) {
                row++;
            }
        }
        this.daysTable = daysTable;
    }

    /**
    Many potential classes (styling) to set:
    1. Today
    2. Selected (model value) date
    3. Selected (model value) date range
    4. Non current (previous or next) month to current view
    */
    setDateClasses(date: string) {
        const classes = {
            today: false,
            todayRange: false,
            selected: false,
            selectedRange: false,
            nonCurrentMonth: false,
            disabled: false,
        };

        const dateMoment = moment(date, this.formatInternal);
        const todayMoment = moment();
        if (todayMoment.format(this.formatInternal) === date) {
            classes.today = true;
        }
        if (this.todayRangeStartDate <= date && date <= this.todayRangeEndDate) {
            classes.todayRange = true;
        }

        if (this.modelInternal === date) {
            classes.selected = true;
        }

        if (this.selectedRangeStartDate <= date && date <= this.selectedRangeEndDate) {
            classes.selectedRange = true;
        }

        if (date < this.minDate || date > this.maxDate) {
            classes.disabled = true;
        }

        const dateMonth = this.momentMonthToMonth(dateMoment.month());
        if (dateMonth.toString() !== this.viewMonth) {
            classes.nonCurrentMonth = true;
        }
        return classes;
    }

    clickDate(date: string, rowIndex: number, colIndex: number) {
        if (this.isValidDate(date)) {
            this.modelInternal = date;
            this.updateModel();
            this.setDate(this.modelInternal, true);
        }
    }

    setMonthYear() {
        const month = this.numberToTwoDigits(parseInt(this.viewMonth, 10));
        const year = this.numberToTwoDigits(this.viewYear);
        // Ensure do not go to an inalid date if the new month has less days.
        let daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
        const day = this.numberToTwoDigits(parseInt(this.viewDay, 10) <= daysInMonth ? this.viewDay : daysInMonth);
        const date = `${year}-${month}-${day}`;
        this.setDate(date, true);
    }

    navMonth() {
        this.setMonthYear();
    }

    navYear() {
        this.setMonthYear();
    }

    navPreviousMonth() {
        const month = parseInt(this.viewMonth, 10);
        const newMonth = (month === 1 ? 12 : month - 1).toString();
        let newYear = this.viewYear;
        if (month === 1) {
            newYear = (parseInt(this.viewYear, 10) - 1).toString();
        }
        if (this.isValidDates(newYear, newMonth, this.viewDay)) {
            this.viewMonth = newMonth;
            this.viewYear = newYear;
            this.setMonthYear();
        }
    }

    navNextMonth() {
        const month = parseInt(this.viewMonth, 10);
        const newMonth = (month === 12 ? 1 : month + 1).toString();
        let newYear = this.viewYear;
        if (month === 12) {
            newYear = (parseInt(this.viewYear, 10) + 1).toString();
        }
        if (this.isValidDates(newYear, newMonth, this.viewDay)) {
            this.viewMonth = newMonth;
            this.viewYear = newYear;
            this.setMonthYear();
        }
    }

    isValidDates(year: string, month: string, day: string) {
        const date = `${year}-${this.numberToTwoDigits(month)}-${this.numberToTwoDigits(day)}`;
        return this.isValidDate(date);
    }

    isValidDate(date: string) {
        if (date >= this.minDate && date <= this.maxDate) {
            return true;
        }
        return false;
    }

    updateModel() {
        const oldVal = this.model;
        const model = moment(this.modelInternal, this.formatInternal).format(this.format);
        this.modelChange.emit(model);
        if (this.onChange) {
            this.onChange.emit({ model: model, oldVal: oldVal });
        }
    }
}
