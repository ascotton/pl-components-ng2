import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { PLLodashService } from '../pl-lodash/pl-lodash.service';

function _isModelEmpty(model: any) {
    let emptyVal: boolean = !model || (Array.isArray(model) && !model.length);
    // File model is an object - need either file(s) or existing file
    if (model && model !== undefined && (model.file !== undefined || model.files !== undefined)) {
        if (!model.file && !model.files.length && !model.existingFiles.length) {
            emptyVal = true;
        } else {
            emptyVal = false;
        }
    }
    return emptyVal;
}

@Injectable()
export class PLInputErrorsService {
    constructor(private plLodash: PLLodashService) {}

    setName(name: string = '') {
        if (name) {
            return name;
        }
        return this.plLodash.randomString();
    }

    isModelEmpty(model: any) {
        return _isModelEmpty(model);
    }

    setDisabled(formControl: any, disabled: boolean, reValidate: boolean = false, model?: any, validations?: any) {
        if (formControl && disabled !== undefined) {
            let changed = false;
            // Important to not toggle unnecessarily - messes with validation.
            // Also, will need to revalidate after toggle disabled state.
            if (disabled && !formControl.disabled) {
                formControl.disable();
                changed = true;
            } else if (!disabled && !formControl.enabled) {
                formControl.enable();
                changed = true;
            }
            if (changed && reValidate) {
                this.reValidate(model, formControl, validations);
            }
        }
    }

    addFormControl(formControl: any, name: string, modelValue: any, disabled: boolean, validations: any = {}) {
        const validators = this.setUpValidators(validations);
        formControl.addControl(name, new FormControl({ value: modelValue, disabled: disabled }, validators));
        // formControl.addControl(name, new FormControl(modelValue, validators));
    }

    setUpValidators(validations: any = {}) {
        const validators: any[] = [];
        if (validations.required) {
            validators.push(Validators.required);
        }
        if (validations.checkboxrequired) {
            validators.push(this.validateCheckboxRequired);
        }
        if (validations.arrayrequired) {
            validators.push(this.validateArrayRequired);
        }
        if (validations.filerequired) {
            validators.push(this.validateFileRequired);
        }
        if (validations.maxfilesize) {
            validators.push(this.validateMaxFileSize(validations.maxfilesize));
        }
        if (validations.fileextensions) {
            validators.push(this.validateFileExtensions(validations.fileextensions));
        }
        if (validations.minlength) {
            validators.push(Validators.minLength(validations.minlength));
        }
        if (validations.maxlength) {
            validators.push(Validators.maxLength(validations.maxlength));
        }
        if (validations.pattern) {
            validators.push(Validators.pattern(validations.pattern));
        }
        if (validations.min || validations.min === 0) {
            validators.push(this.validateMin(validations.min));
        }
        if (validations.max || validations.max === 0) {
            validators.push(this.validateMax(validations.max));
        }
        if (validations.number) {
            validators.push(this.validateNumber);
        }
        if (validations.email) {
            validators.push(this.validateEmail);
        }
        if (validations.url) {
            validators.push(this.validateUrl);
        }
        if (validations.tel) {
            validators.push(this.validateTel);
        }
        if (validations.zipcode) {
            validators.push(this.validateZipcode);
        }
        return validators;
    }

    validateCheckboxRequired(formControl: any) {
        return formControl.value ? null : { checkboxrequired: true };
    }

    validateArrayRequired(formControl: any) {
        return formControl.value && formControl.value.length ? null : { arrayrequired: true };
    }

    validateFileRequired(formControl: any) {
        const model = formControl.value;
        const emptyVal = _isModelEmpty(model);
        return !emptyVal ? null : { filerequired: true };
    }

    validateMaxFileSize(maxfilesize: number) {
        return (formControl: any) => {
            let biggestFileSize = -1;
            const model = formControl.value;
            if (model) {
                if (model.files && model.files.length) {
                    for (let ii = 0; ii < model.files.length; ii++) {
                        let file = model.files[ii];
                        if (file.size > biggestFileSize) {
                            biggestFileSize = file.size;
                        }
                    }
                }
                if (model.file && model.file.size > biggestFileSize) {
                    biggestFileSize = model.file.size;
                }
                if (biggestFileSize > 0) {
                    // Convert to MB.
                    biggestFileSize = biggestFileSize / 1024 / 1024;
                }
            }
            return !formControl.value || maxfilesize === null || biggestFileSize < maxfilesize
                ? null
                : {
                      maxfilesize: { valid: false },
                  };
        };
    }

    validateFileExtensions(fileextensions: string) {
        return (formControl: any) => {
            let extensions = fileextensions.split(',');
            const model = formControl.value;
            let valid = true;
            if (model) {
                if (model.files && model.files.length) {
                    for (let ii = 0; ii < model.files.length; ii++) {
                        let file = model.files[ii];
                        let extension = this.plLodash.getFileExtension(file.name);
                        if (extensions.indexOf(extension) < 0) {
                            valid = false;
                            break;
                        }
                    }
                }
                if (model.file) {
                    let extension = this.plLodash.getFileExtension(model.file.name);
                    if (extensions.indexOf(extension) < 0) {
                        valid = false;
                    }
                }
            }
            return !formControl.value || fileextensions === null || valid
                ? null
                : {
                      fileextensions: { valid: false },
                  };
        };
    }

    validateMin(min: number) {
        return (formControl: any) => {
            // value may be 0, so falsy checks against value are insufficient
            return typeof(formControl.value) === 'undefined' ||
                formControl.value === null ||
                formControl.value === '' ||
                min === null ||
                parseFloat(formControl.value) >= min ? null : { min: { valid: false } };
        };
    }

    validateMax(max: number) {
        // value may be 0, so falsy checks against value are insufficient
        return (formControl: any) => {
            return typeof(formControl.value) === 'undefined' ||
                formControl.value === null ||
                formControl.value === '' ||
                max === null ||
                parseFloat(formControl.value) <= max ? null : { max: { valid: false } };
        };
    }

    validateEmail(formControl: any) {
        // http://emailregex.com/
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !formControl.value || regex.test(formControl.value)
            ? null
            : {
                  email: { valid: false },
              };
    }

    validateUrl(formControl: any) {
        // http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        return !formControl.value || regex.test(formControl.value)
            ? null
            : {
                  url: { valid: false },
              };
    }

    validateZipcode(formControl: any) {
        const regex = /^\d{5}(?:[-\s]\d{4})?$/;
        return !formControl.value || regex.test(formControl.value)
            ? null
            : {
                  zipcode: { valid: false },
              };
    }

    validateTel(formControl: any) {
        //const regex = /[0-9]{9,14}/;
        const regex = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
        return !formControl.value || regex.test(formControl.value)
            ? null
            : {
                  tel: { valid: false },
              };
    }

    validateNumber(formControl: any) {
        const regex = /[0-9]/;
        return !formControl.value || regex.test(formControl.value)
            ? null
            : {
                  number: { valid: false },
              };
    }

    addErrors(formControl: any, newErrors: any = {}) {
        let combinedErrors = Object.assign({}, formControl.errors, newErrors);
        this.setErrors(formControl, combinedErrors);
    }

    setErrors(formControl: any, errors1: any) {
        let errors = errors1;
        if (Object.getOwnPropertyNames(errors).length <= 0) {
            errors = null;
        }
        formControl.setErrors(errors);
    }

    reValidate(model: any, formControl: any, validations: any = {}, setDirty: boolean = true) {
        if (!formControl) {
            return;
        }
        const errors: any[] = [];
        const emptyVal = this.isModelEmpty(model);

        const newErrors: any = {};
        let error: any;
        // TODO - reuse the built in validators?
        if (validations.required && emptyVal) {
            newErrors.required = true;
        }
        if (validations.checkboxrequired) {
            error = this.validateCheckboxRequired({ value: model });
            if (error) {
                newErrors.checkboxrequired = true;
            }
        }
        if (validations.arrayrequired) {
            error = this.validateArrayRequired({ value: model });
            if (error) {
                newErrors.arrayrequired = true;
            }
        }
        if (validations.filerequired) {
            error = this.validateFileRequired({ value: model });
            if (error) {
                newErrors.filerequired = true;
            }
        }
        if (validations.maxfilesize) {
            error = this.validateMaxFileSize(validations.maxfilesize)({
                value: model,
            });
            if (error) {
                newErrors.maxfilesize = true;
            }
        }
        if (validations.fileextensions) {
            error = this.validateFileExtensions(validations.fileextensions)({
                value: model,
            });
            if (error) {
                newErrors.fileextensions = true;
            }
        }
        if ((validations.minlength || validations.minlength === 0) && model.length < validations.minlength) {
            newErrors.minlength = true;
        }
        if (validations.maxlength && model.length > validations.maxlength) {
            newErrors.maxlength = true;
        }
        if (validations.pattern && model.length) {
            const regex = new RegExp(validations.pattern);
            if (!regex.test(model)) {
                newErrors.pattern = true;
            }
        }
        if (validations.min || validations.min === 0) {
            error = this.validateMin(validations.min)({ value: model });
            if (error) {
                newErrors.min = true;
            }
        }
        if (validations.max || validations.max === 0) {
            error = this.validateMax(validations.max)({ value: model });
            if (error) {
                newErrors.max = true;
            }
        }
        if (validations.number) {
            error = this.validateMax(validations.max)({ value: model });
            if (error) {
                newErrors.max = true;
            }
        }
        if (validations.email) {
            error = this.validateEmail({ value: model });
            if (error) {
                newErrors.email = true;
            }
        }
        if (validations.zipcode) {
            error = this.validateZipcode({ value: model });
            if (error) {
                newErrors.zipcode = true;
            }
        }
        if (validations.url) {
            error = this.validateUrl({ value: model });
            if (error) {
                newErrors.url = true;
            }
        }
        if (validations.tel) {
            error = this.validateTel({ value: model });
            if (error) {
                newErrors.tel = true;
            }
        }
        this.setErrors(formControl, newErrors);
        if (setDirty) {
            formControl.markAsDirty();
        }
    }
}
