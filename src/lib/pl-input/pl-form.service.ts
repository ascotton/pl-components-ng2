import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export namespace PLFormService {
    function controls(form: FormArray | FormGroup): Array<AbstractControl> {
          const controls = form.controls;

          if(Array.isArray(controls)) {
              return controls;
          }
          else {
              return Object.keys(controls).map(key => controls[key]);
          }
    }

    export function markAllAsTouched<T extends FormArray | FormGroup>(formCollection: T): T {
        // loosely based on https://github.com/angular/angular/issues/11774
        formCollection.markAsTouched();

        controls(formCollection).forEach((control: AbstractControl) => {
            if(control instanceof FormControl) {
                control.markAsTouched();
            }
            else {
                markAllAsTouched(<FormArray | FormGroup>control);
            }
        });

        return formCollection;
    }
}
