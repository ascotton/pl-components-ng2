import {
    Component,
    ElementRef,
    ViewChild,
    Output,
    EventEmitter,
    forwardRef,
    OnChanges,
    OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-text',
    templateUrl: './pl-input-text.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-text-textarea.component.less'],
    inputs: [
        'model',
        'type',
        'iconLeft',
        'iconRight',
        'clearButton',
        'placeholder',
        'label',
        'required',
        'minlength',
        'maxlength',
        'min',
        'max',
        'disabled',
        'autocomplete',
        'name',
        'pattern',
        'focused',
        'classes',
        'validationMessages',
        'formCtrl',
        'textAlignInput',
        'wholeNumber',
        'revalidate',
        'debounceChange',
        'onPreviewKeyDown',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputTextComponent),
            multi: true,
        },
    ],
})
export class PLInputTextComponent implements OnInit, OnChanges, ControlValueAccessor {
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onFocus = new EventEmitter<any>();
    @Output() onBlur = new EventEmitter<any>();
    @Output() onClickIconLeft = new EventEmitter<any>();
    @Output() onClickIconRight = new EventEmitter<any>();

    @ViewChild('prefix') prefix: ElementRef;
    @ViewChild('input') input: ElementRef;

    model: any = '';
    type: string = 'text';
    iconLeft: string = '';
    iconRight: string = '';
    clearButton: boolean = false;
    placeholder: string = '';
    label: string = '';
    required: boolean = false;
    minlength: number = null;
    maxlength: number = null;
    min: number = null;
    max: number = null;
    pattern: string = null;
    disabled: boolean = false;
    autocomplete: string = 'on';
    name: string = null;
    focused: boolean = false;
    number: boolean = false;
    wholeNumber: boolean = true;
    email: boolean = false;
    zipcode: boolean = false;
    url: boolean = false;
    tel: boolean = false;
    validationMessages: any = {};
    // Must use an object otherwise get "Expression has changed after it was checked" angular error..
    classes: any = {};
    formCtrl: any;
    textAlignInput: string = 'left';
    revalidate: boolean = false;
    debounceChange: number = 0;
    onPreviewKeyDown: any;

    formCtrlSet: boolean = false;
    formControl: any = null;

    classesIconRight: any = {
        'clear-button': false,
    };
    classesContainer: any = {};
    stylesInput: any = {};

    private triggers: any = {
        timeoutChange: null,
        timeoutBlur: null,
    };
    private timeoutBlurDelay: number = 250;
    private blurEvt: any;
    private KEY_CODES: any = {
        bckSpc: 8,
        tab: 9,
        del: 46,
        charA: 65,
        charC: 67,
        charV: 86,
        charX: 88,
        periodNumPad: 110,
        dash: 189,
        period: 190,
    };

    constructor(private plInputErrors: PLInputErrorsService, private plInputShared: PLInputSharedService) { }

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
        this.formClasses();
    }

    ngOnChanges(changes: any) {
        const forceRevalidate = changes.revalidate ? true : false;
        this.init(forceRevalidate);

        if (changes.focused) {
            setTimeout(() => {
                this.focusInput();
            })
        }

        // Condition for (de)activating the input based on the disabled property when onChange
        if (changes.disabled && changes.disabled.previousValue !== undefined) {
            this.formClasses();
        }
    }

    getValidations() {
        return {
            required: this.required,
            minlength: this.minlength,
            maxlength: this.maxlength,
            min: this.min,
            max: this.max,
            email: this.email,
            zipcode: this.zipcode,
            url: this.url,
            tel: this.tel,
            pattern: this.pattern,
            number: this.number,
        };
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
        this.classesContainer = this.plInputShared.formClasses(
            this.focused,
            this.disabled,
            this.required,
            this.model,
            this.type,
            this.formControl,
            this.classes,
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled);
    }

    init(forceRevalidate: boolean = false) {
        if (this.model === undefined) {
            this.model = '';
        }
        this.setValidationByType();
        if (this.clearButton) {
            this.iconRight = 'close';
            this.classesIconRight['clear-button'] = true;
        }
        if (this.model || forceRevalidate) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }

        this.stylesInput['text-align'] = this.textAlignInput;
    }

    setValidationByType() {
        if (this.type === 'email') {
            this.email = true;
        } else if (this.type === 'number') {
            this.number = true;
        } else if (this.type === 'url') {
            this.url = true;
        } else if (this.type === 'tel') {
            this.tel = true;
        } else if (this.type === 'zipcode') {
            this.zipcode = true;
        }
    }

    focusInput() {
        if (this.input && this.input.nativeElement) {
            const inputEle = this.input.nativeElement;
            if (this.focused) {
                inputEle.focus();
                if (inputEle.value) {
                    inputEle.setSelectionRange(0, inputEle.value.length);
                }
            }
        }
    }

    blur(evt: any) {
        this.focused = false;
        this.formClasses();
        this.updateModel(evt, true);
        this.setBlur(evt);
    }

    setBlur(evt: any, overrideEvt: boolean = false) {
        if (!this.blurEvt || overrideEvt) {
            this.blurEvt = evt;
        }
        if (this.triggers.timeoutBlur) {
            clearTimeout(this.triggers.timeoutBlur);
        }
        this.triggers.timeoutBlur = setTimeout(() => {
            if (this.onBlur) {
                this.onBlur.emit({ blurred: true, evt: this.blurEvt });
                // Reset for next time.
                this.blurEvt = null;
            }
        }, this.timeoutBlurDelay);
    }

    focus(evt: any) {
        this.focused = true;
        this.formClasses();
        if (this.onFocus) {
            this.onFocus.emit({ focused: true, evt: evt });
        }
    }

    // Listen for key press on number increment.
    inputEvent(evt: any) {
        if (this.type === 'number') {
            setTimeout(() => {
                this.updateModel(evt, false);
            }, 0);
        }
    }

    /* since change() fires in timeout, event propagation cannot be stopped; use this to preview before change() */
    onKeyDown(evt: any) {
        if (this.onPreviewKeyDown && !this.onPreviewKeyDown(evt)) {
            return;
        }

        this.change(evt);
    }

    change(evt: any) {
        this.updateModelChange(evt);

        if (this.type === 'number') { // Helps number input types
            const keyCode = evt.keyCode;
            const numRegExp = /^-?\d*(.\d+)?$/; // Includes '-' and '.'
            const nonNumpads = (keyCode < 96 || keyCode > 105);
            const endHomeAndArrows = (keyCode > 34 && keyCode < 41);
            const keyCombs = [this.KEY_CODES.charA, this.KEY_CODES.charC, this.KEY_CODES.charV, this.KEY_CODES.charX];
            const keyCodes = [this.KEY_CODES.bckSpc, this.KEY_CODES.tab, this.KEY_CODES.del,
                this.KEY_CODES.periodNumPad, this.KEY_CODES.dash, this.KEY_CODES.period];

            const validNumRegExp = numRegExp.test(evt.key);
            const validKeyCodes = (keyCodes.indexOf(keyCode) !== -1) || endHomeAndArrows;
            const validKeyCombs = ((keyCombs.indexOf(keyCode) !== -1) && (evt.ctrlKey || evt.metaKey));
            const nan = (evt.shiftKey || !validNumRegExp) && nonNumpads;

            if (validNumRegExp || validKeyCodes || validKeyCombs) {
                return;
            }
            if (nan) { // Not a Number
                evt.preventDefault();
            }
        }
    }

    updateModelChange(evt: any) {
        let activateCSS = false;

        if (evt.keyCode === this.KEY_CODES.tab) {
            activateCSS = true;
            this.setBlur(evt, true);
        }

        this.updateModel(evt, activateCSS);
    }

    updateModel(evt: any, activateCSS: boolean) {
        // Block empty input from satisfying required.
        // But do not want to always trim as that can make typing sentences with spaces difficult.
        if (typeof this.model === 'string' && this.model.trim().length < 1) {
            this.model = this.model.trim();
        }

        const oldVal = this.model;

        if (this.type === 'number') {
            let parsedModel: any;
            if (this.wholeNumber) {
                parsedModel = parseInt(this.model);
            } else {
                parsedModel = parseFloat(this.model);
            }
            if (!isNaN(parsedModel)) {
                this.model = parsedModel;
            }
        }
        if (activateCSS) {
            this.formClasses();
        }

        this.propagateChange(this.model);
        this.modelChange.emit(this.model);

        if (this.onChange) {
            if (this.triggers.timeoutChange) {
                clearTimeout(this.triggers.timeoutChange);
            }
            this.triggers.timeoutChange = setTimeout(() => {
                this.onChange.emit({
                    model: this.model,
                    oldVal: oldVal,
                    evt: evt,
                });
            }, this.debounceChange);
        }
    }

    clickIconLeft() {
        if (this.onClickIconLeft) {
            this.onClickIconLeft.emit();
        }
    }

    clickIconRight(evt: any) {
        if (this.clearButton) {
            this.model = '';
            this.change(evt);
            this.focused = true;
            this.formClasses();
            this.focusInput();
        }
        if (this.onClickIconRight) {
            this.onClickIconRight.emit();
        }
    }
}
