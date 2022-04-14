import { Injectable } from '@angular/core';

import { PLInputErrorsService } from './pl-input-errors.service';

@Injectable()
export class PLInputSharedService {
    constructor(private plInputErrors: PLInputErrorsService) {}

    formClasses(
        focused: boolean = false,
        disabled: boolean = false,
        required: boolean = false,
        model: any,
        type: string,
        formControl: any,
        classes: any = {}
    ) {
        const empty = this.plInputErrors.isModelEmpty(model);
        let dirty = false;
        let invalid = false;
        let valid = false;
        if (formControl) {
            dirty = formControl.dirty;
            invalid = formControl.invalid;
            valid = formControl.valid;
        }
        if (classes['ng-valid'] !== undefined) {
            classes.valid = classes['ng-valid'];
        }
        if (classes['ng-invalid'] !== undefined) {
            classes.invalid = classes['ng-invalid'];
        }
        if (classes['ng-dirty'] !== undefined) {
            classes.dirty = classes['ng-dirty'];
        }
        // const invalidCombined = (invalid || classes.invalid);
        return {
            focused: classes.focused !== undefined ? classes.focused : focused,
            disabled: classes.disabled !== undefined ? classes.disabled : disabled,
            required: classes.required !== undefined ? classes.required : required,
            // invalid: invalidCombined,
            // valid: (!invalidCombined && dirty),
            // dirty: dirty,
            'ng-invalid': classes.invalid !== undefined ? classes.invalid : invalid,
            'ng-valid': classes.valid !== undefined ? classes.valid : valid,
            'ng-dirty': classes.dirty !== undefined ? classes.dirty : dirty,
            emptyValue: classes.empty !== undefined ? classes.empty : empty,
            notEmptyValue: classes.empty !== undefined ? !classes.empty : !empty,
        };
    }

    containsFocus(hostElement: any, activeElement: any): boolean {
        if (activeElement === null) {
            return false;
        }
        else {
            return hostElement === activeElement || hostElement.contains(activeElement);
        }
    }
}
