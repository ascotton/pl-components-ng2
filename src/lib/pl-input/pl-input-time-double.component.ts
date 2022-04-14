import {
    Component, Output, EventEmitter,
    ElementRef, ViewChild,
    Input, AfterViewInit, OnInit, OnChanges,
} from '@angular/core';
import * as moment from 'moment';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-time-double',
    templateUrl: './pl-input-time-double.component.html',
    styleUrls: ['./pl-input-time-double.component.less'],
})

/**
 * The two reason why we are making a custom component like this:
 * - There is currently no CDK implementation despite this 4 year old open issue - https://github.com/angular/components/issues/5648
 * - And our use case warrants dropdowns with configurable increments more so than the clock style interface
 */
export class PLInputTimeDoubleComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() model = '';
    @Input() label = '';
    @Input() formCtrl: any;
    @Input() numHours = 24;
    @Input() start = '06:00';
    @Input() minutesStep = 30;
    @Input() format = 'HH:mm';
    @Input() required = false;
    @Input() disabled = false;
    @Input() placeholder = '';
    @Input() maxTime = '23:59';
    @Input() minTime = '00:00';
    @Input() showOptions = true;
    @Input() formatDisplay = 'h:mma';
    @Input() validationMessages: any = {};
    @Input() dropdownContainerSelector = 'body';

    @Output() readonly onChange = new EventEmitter<any>();
    @Output() readonly modelChange = new EventEmitter<any>();

    @ViewChild('input') input: ElementRef;
    @ViewChild('dropdown') dropdown: ElementRef;

    classes: any = {};
    classesContainer: any = {};

    focused = false;
    formCtrlSet = false;
    formControl: any = null;

    getNativeElementsErrorCounter = 0;

    hourSelected: any;
    hourToHighLight: string;
    hasOptionsOpened = false;

    modelInput = '';
    minHourTime = '00';
    maxHourTime = '23';
    minMinutesTime = '00';
    maxMinutesTime = '59';
    minuteSelected: string;
    meridiemSelected: string;
    minuteToHighLight: string;
    meridiemToHighLight: string;

    name = '';

    timeOptionsHours = [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '00', label: '12' },
    ];
    timeOptionsMinutes = [
        { value: '00', label: '00' },
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
        { value: '13', label: '13' },
        { value: '14', label: '14' },
        { value: '15', label: '15' },
        { value: '16', label: '16' },
        { value: '17', label: '17' },
        { value: '18', label: '18' },
        { value: '19', label: '19' },
        { value: '20', label: '20' },
        { value: '21', label: '21' },
        { value: '22', label: '22' },
        { value: '23', label: '23' },
        { value: '24', label: '24' },
        { value: '25', label: '25' },
        { value: '26', label: '26' },
        { value: '27', label: '27' },
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' },
        { value: '31', label: '31' },
        { value: '32', label: '32' },
        { value: '33', label: '33' },
        { value: '34', label: '34' },
        { value: '35', label: '35' },
        { value: '36', label: '36' },
        { value: '37', label: '37' },
        { value: '38', label: '38' },
        { value: '39', label: '39' },
        { value: '40', label: '40' },
        { value: '41', label: '41' },
        { value: '42', label: '42' },
        { value: '43', label: '43' },
        { value: '44', label: '44' },
        { value: '45', label: '45' },
        { value: '46', label: '46' },
        { value: '47', label: '47' },
        { value: '48', label: '48' },
        { value: '49', label: '49' },
        { value: '50', label: '50' },
        { value: '51', label: '51' },
        { value: '52', label: '52' },
        { value: '53', label: '53' },
        { value: '54', label: '54' },
        { value: '55', label: '55' },
        { value: '56', label: '56' },
        { value: '57', label: '57' },
        { value: '58', label: '58' },
        { value: '59', label: '59' },
    ];

    private hoursNativeElements: any[];
    private minutesNativeElements: any;
    private hoursDropDownNativeElement: any;
    private minutesDropDownNativeElement: any;
    private modelInputFormat = 'HH:mm';
    private modelInputFormatDisplay = 'hh:mm A';
    private lastModelInput = '';
    private minMaxFormat = 'HH';
    private formatDisplayFinal = '';
    private formatFinal = '';
    private amValueArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '00'];
    private pmValueArray = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '12'];

    constructor(
        private plInputErrors: PLInputErrorsService,
        private plInputShared: PLInputSharedService,
    ) { }

    // To enabled form validation.
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    writeValue(value: any) { }
    propagateChange = (_: any) => { };
    registerOnChange(fn: any) { this.propagateChange = fn; };

    ngOnInit() {
        this.setFormCtrl();
        this.init();
    }

    ngOnChanges() {
        this.init();
    }

    ngAfterViewInit() {
        const hourFromModel = this.model.slice(0, 2);
        const amOrPm = (+hourFromModel >= 12 && +hourFromModel < 24) ? 'PM' : 'AM';

        this.getNativeElements();
        this.setHourMinuteSelected(hourFromModel, this.model.slice(3));
        this.setMeridiemSelected(amOrPm);
    }

    formClasses() {
        this.classesContainer = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            'time',
            this.formControl,
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
        this.classes = this.classesContainer;
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

    init() {
        this.setFormats();
        if (this.model && moment(this.model, this.format, true).isValid()) {
            this.modelInput = moment(this.model, this.format, true).format(this.formatFinal);
        } else {
            this.modelInput = '';
        }
        this.setModelInput();
        if (this.model) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
    }

    /**
    // We have options for formats, but the native `time` input may require certain ones that will
    // override them. So this will give us the final 3 formats:
    - input & dropdown value
    - input & dropdown display
    */
    setFormats() {
        // TODO - for certain browsers / platforms, change the formats.
        this.formatDisplayFinal = this.modelInputFormatDisplay;
        this.formatFinal = this.modelInputFormat;
        this.placeholder = this.formatDisplayFinal;
    }

    setValFromInput() {
        if (!this.modelInput) {
            this.setModel('');
        } else {
            const value = moment(this.modelInput, this.formatFinal, true);
            if (!value.isValid() || !this.isValidTime(value)) {
                this.modelInput = this.lastModelInput;
            } else {
                this.setModel(value.format(this.formatFinal));
            }
        }
        this.lastModelInput = this.modelInput;
    }

    updateModel() {
        const oldVal = this.model;
        const model = this.modelInput ? moment(this.modelInput, this.formatFinal).format(this.format) : '';
        this.propagateChange(model);
        this.modelChange.emit(model);
        if (this.onChange) {
            this.onChange.emit({ model, oldVal });
        }
        this.plInputErrors.reValidate(model, this.formControl, this.getValidations());
        this.formClasses();
    }

    /**
     * @param selectorClicked Tells if the calling comes from a click in the selector drop-down
     */
    private getTimesTogether(selectorClicked: boolean = false) {
        this.modelInput = `${this.hourSelected}:${this.minuteSelected}`;

        this.setModel(this.modelInput);
        this.focused = false;
        this.formClasses();

        this.highLightTimesInDropDown(selectorClicked);
    }

    /**
     * Updates the 'hourSelected' based on the 'meridiemSelected'
     * If AM; 01, 02, 03, and so on
     * if PM: 13, 14, 15, and so on
     * Scenario for when a meridiem is selected and then the time is updated by the user
     */
    private switchValueHoursBasedOnMeridiem() {
        const findHourInArray = (element: { value: string, label: string }) => {
            return element.value === this.hourSelected;
        };
        let hourSelectedIndex = this.timeOptionsHours.findIndex(findHourInArray);

        if (hourSelectedIndex === -1) { // Switch meridiems if the hour selected is not found in the current array.
            const meridiemArray = this.meridiemSelected === 'AM' ? this.pmValueArray : this.amValueArray;
            hourSelectedIndex = meridiemArray.findIndex((element: string) => element === this.hourSelected);
        }

        try {
            this.setHourMinuteSelected(this.timeOptionsHours[hourSelectedIndex].value, '');
        } catch (error) {
            this.setHourMinuteSelected('', '');
        }
    }

    //#region Validations

    getValidations() {
        return { required: this.required };
    }

    isValidTime(timeMoment: any) {
        const time = timeMoment.format(this.minMaxFormat);
        if (this.minTime && time < this.minTime) {
            return false;
        }
        if (this.maxTime && time > this.maxTime) {
            return false;
        }
        return true;
    }

    private isValidMomentTime(momentTime: any, format: string, hrOrMinToValidate: string) {
        let isValid = true;
        const momentFormatted = momentTime.format(format);
        const minTimeToUse = hrOrMinToValidate === 'hourSelected' ? this.minHourTime : this.minMinutesTime;
        const maxTimeToUse = hrOrMinToValidate === 'hourSelected' ? this.maxHourTime : this.maxMinutesTime;

        if ((minTimeToUse && maxTimeToUse) && (momentFormatted > maxTimeToUse && momentFormatted < minTimeToUse)) {
            isValid = !isValid;
        }

        return isValid;
    }

    //#endregion Validations

    //#region DOM Actions

    // Listen for key press on number increment.
    inputEvent(evt: any) {
        const value = moment(evt.target.value, this.formatFinal, true);
        if (value.isValid() && this.isValidTime(value)) {
            setTimeout(() => {
                this.setModel(value.format(this.formatFinal));
            },         0);
        }
    }

    onBlurInput(info: { blurred: boolean; evt: any }) {
        this.unFocus(info.evt);
    }

    onBlurDropdown(info: { blurred: boolean; evt: any }) {
        this.unFocus(info.evt);
    }

    // KeyboardEvent.keyCode is deprecated https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    onChangeInput(info: { model: string; evt: any }) {
        if (info.evt && info.evt.code) {
            const keyCode = info.evt.code;
            switch (keyCode) {
                    case 'Enter':
                        if (!this.hasOptionsOpened) {
                            this.setValFromInput();
                            this.formClasses();
                            this.toggleOptionsDropDown();
                        }
                        break;

                    case 'Escape':
                        if (this.hasOptionsOpened) {
                            this.hasOptionsOpened = !this.hasOptionsOpened;
                        }
                        break;

                    default:
                        if (info && info.model) {
                            this.setHourMinuteSelected(info.model.slice(0, 2), info.model.slice(3));
                            this.highLightTimesInDropDown();
                        }
            }
        }
    }

    /**
     * Set the hour and minute selected by the user for using 'em across the class
     * If the moment time isn't valid; use the lastModelInput
     * Call getTimesTogether for merging hours, minutes and meridiem as a whole time.
    */
    onSelectTime(timeSelected: { value: string, label: string }, formatForTime: string) {
        let hourToSet: string;
        let minuteToSet: string;
        const momentTime = moment(timeSelected.value, formatForTime, true);
        const hourOrMinute = formatForTime === 'HH' ? 'hourSelected' : 'minuteSelected';

        if (this.isValidMomentTime(momentTime, formatForTime, hourOrMinute)) {
            hourToSet = hourOrMinute === 'hourSelected' ? timeSelected.value : '';
            minuteToSet = hourOrMinute === 'minuteSelected' ? timeSelected.value : '';
            this.setHourMinuteSelected(hourToSet, minuteToSet);
        } else {
            hourToSet = hourOrMinute === 'hourSelected' ? this.lastModelInput.slice(0, 2) : '';
            minuteToSet = hourOrMinute === 'minuteSelected' ? this.lastModelInput.slice(3) : '';
            this.setHourMinuteSelected(hourToSet, minuteToSet);
        }

        // If a meridiem is selected switch the hours (PM to AM or AM to PM)
        if (hourOrMinute === 'minuteSelected') {
            this.switchValueHoursBasedOnMeridiem();
        }

        this.getTimesTogether(true);
    }

    /**
     * Sets the 'meridiemSelected' to AM or PM
     * Updates the values of the 'timeOptionsHours'
     *   If AM; 01, 02, 03, and so on
     *   if PM: 12, 14, 15, and so on
     * Switch (update) the values of the hours since the meridiem selected changed
     */
    onSelectMeridiem(meridiem: string) {
        this.setMeridiemSelected(meridiem);
        this.switchValueHoursBasedOnMeridiem();
        this.getTimesTogether();
    }

    /**
     * Open / Closes options dropdown
     *   Click on down arrow toggles the opening of the dropdown
     *   Click within input box or call within the class just opens the options
     * If the dropdown is opened a dom manipulation is performed on the options
     * @param evt Gotten only when called from the template
     */
    toggleOptionsDropDown(evt?: any) {
        if (evt && typeof evt.target.className !== 'string') {
            this.hasOptionsOpened = !this.hasOptionsOpened;
        } else {
            this.hasOptionsOpened = true;
        }

        if (this.hasOptionsOpened) {
            this.input.nativeElement.querySelector('input').focus();
            this.setHourMinuteSelected(this.model.slice(0, 2), this.model.slice(3));
            this.highLightTimesInDropDown();
        } else {
            this.input.nativeElement.querySelector('input').blur();
        }
    }

    unFocus(evt: any) {
        const isKeyTab = evt.code === 'Tab';
        const isTargetInInput = this.input.nativeElement.contains(evt.target);
        const isActiveElementInInput = this.input.nativeElement.contains(document.activeElement);

        if (!isTargetInInput || (isKeyTab && !isActiveElementInInput)) {
            this.closeDropDown();
        }
        // Below condition supports the component within a modal.
        if (isTargetInInput && !isActiveElementInInput && !isKeyTab) {
            this.closeDropDown();
        }
    }

    private closeDropDown() {
        this.focused = false;
        this.formClasses();
        this.hasOptionsOpened = false;
    }

    //#endregion DOM Actions

    //#region DOM Manipulations

    private getNativeElements() {
        try {
            this.hoursNativeElements = this.dropdown.nativeElement.getElementsByClassName('option-hr');
            this.minutesNativeElements = this.dropdown.nativeElement.getElementsByClassName('option-min');
            this.hoursDropDownNativeElement = this.dropdown.nativeElement.getElementsByClassName('options-hour')[0];
            this.minutesDropDownNativeElement = this.dropdown.nativeElement.getElementsByClassName('options-min')[0];
        } catch {
            if (this.getNativeElementsErrorCounter < 3) {
                setTimeout(() => {
                    this.getNativeElements();
                },         100);
                this.getNativeElementsErrorCounter++;
            }
        }
    }

    /**
     * @param selectorClicked Tells if the calling comes from a click in the selector drop-down
     */
    private highLightTimesInDropDown(selectorClicked: boolean = false) {
        // Toggles automatically the meridiam based on the scenario
        if ((+this.hourSelected >= 0 && +this.hourSelected <= 11) && this.meridiemSelected === 'PM') {
            this.setMeridiemSelected('AM');
        } else if ((+this.hourSelected >= 12 && +this.hourSelected <= 23) && this.meridiemSelected === 'AM') {
            this.setMeridiemSelected('PM');
        }

        // Find the hour and minute indexes to highlight, and to scroll to.
        let hourIndex = 11;
        const minuteIndex = +this.minuteSelected - 1;
        if (this.hourSelected !== '00') {
            hourIndex = +this.hourSelected - 12 > 0 ? +this.hourSelected - 13 : +this.hourSelected - 1;
        }

        // Perform the highlight and scrolling
        this.highlightHour(hourIndex);
        this.highlightMinute(minuteIndex + 1);
        this.highlightMeridiem(this.meridiemSelected);
        if (!selectorClicked) {
            this.scrollToIndexInDropDown(hourIndex, minuteIndex);
        }
    }

    private highlightHour(indexTohighlight: number) {
        if (this.hoursNativeElements.length > 0 && indexTohighlight > -1) {
            this.hourToHighLight = this.timeOptionsHours[indexTohighlight].label;
        }
    }

    private highlightMinute(indexTohighlight: number) {
        if (this.minutesNativeElements.length > 0 && indexTohighlight > -1) {
            this.minuteToHighLight = this.timeOptionsMinutes[indexTohighlight].label;
        }
    }

    private highlightMeridiem(meridiem: string) {
        this.meridiemToHighLight = meridiem;
    }

     /**
     * Moves the position of the scroll to the index of the hour and minute
     *
     * @param hourIndex The index of the hour to scroll in the hours dropdown
     * @param minuteIndex  The index of the minute to scroll in the minutes dropdown
     */
    private scrollToIndexInDropDown(hourIndex: number = -1, minuteIndex: number = -1) {
        setTimeout(() => {
            let targetDropDown = 0;

            if (this.hoursDropDownNativeElement && (hourIndex >= 0 && hourIndex < this.hoursNativeElements.length)) {
                const target = this.hoursNativeElements[hourIndex].offsetTop;
                targetDropDown = target - 120;
                this.hoursDropDownNativeElement.scrollTo(0, targetDropDown);
            }

            if (this.minutesDropDownNativeElement && (minuteIndex >= 0 && minuteIndex < this.minutesNativeElements.length)) {
                const target = this.minutesNativeElements[minuteIndex].offsetTop;
                targetDropDown = target - 50;
                this.minutesDropDownNativeElement.scrollTo(0, targetDropDown);
            }
        },         0);
    }

    //#endregion DOM Manipulations

    //#region Uncatalog Privates

    private setModel(val: any) {
        this.modelInput = val;
        this.updateModel();
    }

    private setModelInput() {
        this.lastModelInput = this.modelInput;
    }

    private setMeridiemSelected(meridiem: string) {
        this.meridiemSelected = meridiem;
        this.updateHourOptionsValue(meridiem);
    }

    private setHourMinuteSelected(hour: string, minute: string) {
        this.hourSelected = hour !== '' ? hour : this.hourSelected;
        this.minuteSelected = minute !== '' ? minute : this.minuteSelected;
    }

    /**
     * Updates the objects in the array holding the hours that the user visualizes in the drop-down.
     * Specifically the `value` property is the one updated within each object in the array.
     * The update is done based on the meridiem this is `AM` or `PM`.
     * The hours have to be updated, since AM would use 01, 02, etc. and PM would use 13, 14, etc.
     * 
     * @param meridiem - The `AM` or `PM` meridiem value
     */
    private updateHourOptionsValue(meridiem: string) {
        const meridiemToUse = meridiem === 'AM' ? this.amValueArray : this.pmValueArray;

        this.timeOptionsHours.forEach((times, index) => {
            times.value = meridiemToUse[index];
        });
    }

    //#region Uncatalog Privates
}
