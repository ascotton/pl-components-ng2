import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { PLFormService } from './pl-form.service';

describe('PLFormService', () => {
    describe('markAllAsTouched', () => {
        const markAllAsTouched = PLFormService.markAllAsTouched;

        let formGroup: FormGroup;
        let firstControl: FormControl;

        let nestedFormGroup: FormGroup;
        let firstNestedFormControl: FormControl;

        let nestedFormArray: FormArray;
        let secondNestedFormControl: FormControl;

        beforeEach(() => {
            firstControl = new FormControl('first_name');
            firstNestedFormControl = new FormControl('middle_name');
            secondNestedFormControl = new FormControl('last_name');

            nestedFormGroup = new FormGroup({firstNested: firstNestedFormControl});
            nestedFormArray = new FormArray([secondNestedFormControl]);

            formGroup = new FormGroup({
                first: firstControl,
                nestedGroup: nestedFormGroup,
                nestedArray: nestedFormArray,
            });
        });

        it('marks form group as touched', () => {
            markAllAsTouched(formGroup);

            expect(formGroup.touched).toBeTruthy();
        });

        it('marks child controls as touched', () => {
            markAllAsTouched(formGroup);

            expect(firstControl.touched).toBeTruthy();
        });

        it('marks nested form groups as touched', () => {
            markAllAsTouched(formGroup);

            expect(nestedFormGroup.touched).toBeTruthy();
        });

        it('marks nested form group child controls as touched', () => {
            markAllAsTouched(formGroup);

            expect(firstNestedFormControl.touched).toBeTruthy();
        });

        it('marks nested form array child controls as touched', () => {
            markAllAsTouched(formGroup);

            expect(secondNestedFormControl.touched).toBeTruthy();
        });

        it('marks an empty form group as touched', () => {
            formGroup = new FormGroup({});

            expect(markAllAsTouched(formGroup).touched).toBeTruthy();
        });
    });
});
