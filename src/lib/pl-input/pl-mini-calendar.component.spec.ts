import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLMiniCalendarService } from './pl-mini-calendar.service';
import { PLMiniCalendarComponent } from './pl-mini-calendar.component';

class PLMiniCalendarServiceStub {}

describe('PLMiniCalendarComponent', () => {
    let comp: PLMiniCalendarComponent;
    let fixture: ComponentFixture<PLMiniCalendarComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [ PLMiniCalendarComponent ],
            providers: [
                { provide: PLMiniCalendarService, useClass: PLMiniCalendarServiceStub },
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLMiniCalendarComponent);
        comp = fixture.componentInstance;

        comp.model = '2008-01-01';
        comp.format = 'YYYY-MM-DD';
        comp.firstDayOfWeek = 0;
        comp.minDate = '2007-01-01';
        comp.maxDate = '2010-01-01';
        comp.selectedRange = 'day';
        comp.todayRange = 'month';
        comp.monthOptsFormat = 'MMM';
        fixture.detectChanges();
    });

    it('setDefaults - should set the calendar defaults', () => {
        comp.setDefaults();
        expect(comp.format).toEqual('YYYY-MM-DD');
        expect(comp.firstDayOfWeek).toEqual(0);
        expect(comp.selectedRange).toEqual('day');
        expect(comp.todayRange).toEqual('month');
        expect(comp.monthOptsFormat).toEqual('MMM');
    });

    it('setDefaults - should set the calendar defaults when defaults are not set', () => {
        comp.format = '';
        comp.firstDayOfWeek = undefined;
        comp.selectedRange = '';
        comp.todayRange = '';
        comp.monthOptsFormat = '';
        comp.setDefaults();
        expect(comp.format).toEqual('YYYY-MM-DD');
        expect(comp.firstDayOfWeek).toEqual(0);
        expect(comp.selectedRange).toEqual('day');
        expect(comp.todayRange).toEqual('month');
        expect(comp.monthOptsFormat).toEqual('MMM');
    });

    it('setMinAndMaxDate - should set the min and max dates', () => {
        comp.modelInternal = '2017-08-24';
        comp.minDate = '';
        comp.maxDate = '';
        comp.setMinAndMaxDate();
        expect(comp.minDate).toEqual('1992-08-01');
        expect(comp.maxDate).toEqual('2042-08-31');
    });

    it('setWeekdaysHeader - should set the weekdays header', () => {
        comp.setWeekdaysHeader();
        expect(comp.weekdaysHeader).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    });

    it('setWeekdaysHeader - should set the weekdays header with offset', () => {
        comp.firstDayOfWeek = 1;
        comp.setWeekdaysHeader();
        expect(comp.weekdaysHeader).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });

    it('setMonthOpts - should set the month options with abbreviated months', () => {
        comp.setMonthOpts();
        const monthOpts = [
            {
                value: '1',
                label: 'Jan'
            },
            {
                value: '2',
                label: 'Feb'
            },
            {
                value: '3',
                label: 'Mar'
            },
            {
                value: '4',
                label: 'Apr'
            },
            {
                value: '5',
                label: 'May'
            },
            {
                value: '6',
                label: 'Jun'
            },
            {
                value: '7',
                label: 'Jul'
            },
            {
                value: '8',
                label: 'Aug'
            },
            {
                value: '9',
                label: 'Sep'
            },
            {
                value: '10',
                label: 'Oct'
            },
            {
                value: '11',
                label: 'Nov'
            },
            {
                value: '12',
                label: 'Dec'
            }
        ];
        expect(comp.monthOpts).toEqual(monthOpts);
    });

    it('setMonthOpts - should set the month options with full name of months', () => {
        comp.monthOptsFormat = 'MMMM'
        comp.setMonthOpts();
        const monthOpts = [
            {
                value: '1',
                label: 'January'
            },
            {
                value: '2',
                label: 'February'
            },
            {
                value: '3',
                label: 'March'
            },
            {
                value: '4',
                label: 'April'
            },
            {
                value: '5',
                label: 'May'
            },
            {
                value: '6',
                label: 'June'
            },
            {
                value: '7',
                label: 'July'
            },
            {
                value: '8',
                label: 'August'
            },
            {
                value: '9',
                label: 'September'
            },
            {
                value: '10',
                label: 'October'
            },
            {
                value: '11',
                label: 'November'
            },
            {
                value: '12',
                label: 'December'
            }
        ];
        expect(comp.monthOpts).toEqual(monthOpts);
    });

    it('setYearOpts - should set year options', () => {
        const yearOpts = [
            {
                value: '2007',
                label: 2007
            },
            {
                value: '2008',
                label: 2008
            },
            {
                value: '2009',
                label: 2009
            }
        ];
        comp.minYear = 2007;
        comp.maxYear = 2009;
        comp.setYearOpts();
        expect(comp.yearOpts).toEqual(yearOpts);
    });

    it("momentMonthToMonth - should return moment month of month that's a number", () => {
        expect(comp.momentMonthToMonth(0)).toEqual(1);
    });

    it("momentMonthToMonth - should return moment month of month that's a string", () => {
        expect(comp.momentMonthToMonth('1')).toEqual(2);
    });

    it("momentMonthToMonth - should return moment month of month that's a string and begin with 0", () => {
        expect(comp.momentMonthToMonth('01')).toEqual(2);
    });

    it('setDate - should set the date from given date', () => {
        comp.setDate('2008-02-21', false, false);
        expect(comp.viewDate).toEqual('2008-02-21');
    });

    it('setDate - should set the date from given date and validate', () => {
        comp.setDate('2008-02-21', false, true);
        expect(comp.viewDate).toEqual('2008-02-21');
    });

    it("numberToTwoDigits - should return a two digit number of a number that's a string", () => {
        expect(comp.numberToTwoDigits('1')).toEqual('01');
    });

    it("numberToTwoDigits - should return a two digit number of a number that's a number", () => {
        expect(comp.numberToTwoDigits(1)).toEqual('01');
    });

    it("numberToTwoDigits - should return the provided two digit number", () => {
        expect(comp.numberToTwoDigits(10)).toEqual('10');
    });

    it('getDateRange - should get the month range of date', () =>{
        const vals = {
            start: '2017-01-01',
            end: '2017-01-31'
        }
        expect(comp.getDateRange('2017-01-05', 'month')).toEqual(vals);
    });

    it('getDateRange - should get the week range of date', () =>{
        const vals = {
            start: '2017-01-01',
            end: '2017-01-07'
        }
        expect(comp.getDateRange('2017-01-05', 'week')).toEqual(vals);
    });

    it('getDateRange - should get the week range of date with offset', () =>{
        comp.firstDayOfWeek = 1;
        const vals = {
            start: '2017-01-02',
            end: '2017-01-08'
        }
        expect(comp.getDateRange('2017-01-05', 'week')).toEqual(vals);
    });

    it('getDateRange - should get the week range of date with offset', () =>{
        comp.firstDayOfWeek = 5;
        const vals = {
            start: '2016-12-30',
            end: '2017-01-05'
        }
        expect(comp.getDateRange('2017-01-05', 'week')).toEqual(vals);
    });

    it('getDateRange - should get the day range of the date', () =>{
        comp.modelInternal = '2017-01-05';
        const vals = {
            start: '2017-01-05',
            end: '2017-01-05'
        }
        expect(comp.getDateRange('2017-01-05', 'day')).toEqual(vals);
    });

    it('setStartAndEndViewDates - should set the start and end view date', () => {
        comp.viewDate = '2017-08-30';
        comp.setStartAndEndViewDates();
        expect(comp.startViewDate).toEqual('2017-07-30');
        expect(comp.endViewDate).toEqual('2017-09-02');
    });

    it('setStartAndEndViewDates - should set the start and end view date', () => {
        comp.firstDayOfWeek = 1;
        comp.viewDate = '2017-08-30';
        comp.setStartAndEndViewDates();
        expect(comp.startViewDate).toEqual('2017-07-31');
        expect(comp.endViewDate).toEqual('2017-09-03');
    });

    it('setStartAndEndViewDates - should set the start and end view date', () => {
        comp.firstDayOfWeek = 5;
        comp.viewDate = '2017-08-30';
        comp.setStartAndEndViewDates();
        expect(comp.startViewDate).toEqual('2017-07-28');
        expect(comp.endViewDate).toEqual('2017-08-31');
    });

    it('setDateClasses - shoud set date classes', () => {
        const classes = {
            today: false,
            todayRange: false,
            selected: false,
            selectedRange: false,
            nonCurrentMonth: true,
            disabled: true,
        };
        expect(comp.setDateClasses('2013-08-25')).toEqual(classes);
    });

    it('clickDate - should click the given existing date', () => {
        comp.clickDate('2008-01-14', 0, 0);
        expect(comp.modelInternal).toEqual('2008-01-14');
    });

    it("clickDate - should not click the date that doesn't exist", () => {
        comp.clickDate('2017-01-01', 0, 0);
        expect(comp.modelInternal).toEqual('2008-01-01');
    });

    it('setMonthYear - should set the date to a new month or year', () => {
        comp.viewDay = '10';
        comp.viewMonth = '05';
        comp.viewYear = '2008';
        comp.setMonthYear();
        expect(comp.viewDate).toEqual('2008-05-10');
    });

    it('navPreviousMonth - should navigate to previous month', () => {
        comp.viewDay = '7';
        comp.viewMonth = '5';
        comp.viewYear = '2008'
        comp.navPreviousMonth();
        expect(comp.viewMonth).toEqual('4');
        expect(comp.viewYear).toEqual('2008');
    });

    it('navPreviousMonth - should navigate to previous month and year when month is January', () => {
        comp.viewDay = '7';
        comp.viewMonth = '1';
        comp.viewYear = '2008'
        comp.navPreviousMonth();
        expect(comp.viewMonth).toEqual('12');
        expect(comp.viewYear).toEqual('2007');
    });

    it('navNextMonth - should navigate to next month', () => {
        comp.viewDay = '7';
        comp.viewMonth = '5';
        comp.viewYear = '2008'
        comp.navNextMonth();
        expect(comp.viewMonth).toEqual('6');
        expect(comp.viewYear).toEqual('2008');
    });

    it('navNextMonth - should navigate to next month and year when month is December', () => {
        comp.viewDay = '7';
        comp.viewMonth = '12';
        comp.viewYear = '2008'
        comp.navNextMonth();
        expect(comp.viewMonth).toEqual('1');
        expect(comp.viewYear).toEqual('2009');
    });

    it('isValidDates - should return true since dates are valid', () => {
        expect(comp.isValidDates('2008', '1', '5')).toEqual(true);
    });

    it('isValidDates - should return false since dates are invalid', () => {
        expect(comp.isValidDates('2000', '1', '5')).toEqual(false);
    });

    it('isValidDate - should return true since date is valid', () => {
        expect(comp.isValidDate('2008-01-05')).toEqual(true);
    });

    it('isValidDate - should return false since date is invalid', () => {
        expect(comp.isValidDate('2017-01-01')).toEqual(false);
    });

    it('updateModel - should update model', () => {
        let newModel: string;
        let modelChange: {};
        comp.modelInternal = '2008-02-02';
        comp.modelChange.subscribe((model: string) => newModel = model);
        comp.onChange.subscribe((change: {}) => modelChange = change);
        comp.updateModel();
        expect(newModel).toEqual('2008-02-02');
        expect(modelChange).toEqual({ model: '2008-02-02', oldVal: '2008-01-01' })
    });
});
