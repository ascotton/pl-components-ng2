import { Component, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PLLodashService } from '../pl-lodash/pl-lodash.service';
import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';
import { PLInputMimeTypesService } from './pl-input-mime-types.service';

@Component({
    selector: 'pl-input-file',
    templateUrl: './pl-input-file.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-file.component.less'],
    inputs: [
        'model',
        'multiple',
        'mimeTypes',
        // This is needed to validate drag & drop; mimeTypes will only validate for the file picker.
        // If blank, extensions will be set based on mimeTypes - see pl-input-mime-types for supported mappings.
        'extensions',
        'existingFiles',
        'placeholder',
        'label',
        'disabled',
        'required',
        'validationMessages',
        'formCtrl',
        'maxFileSize',
        'customDragText',
        'customClickText',
        'errorMode',
        'dropzone',
        'fixtureId',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PLInputFileComponent),
            multi: true,
        },
    ],
})
export class PLInputFileComponent implements ControlValueAccessor {
    @Output() modelChange = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onValidateSingleFileExtension = new EventEmitter<any>();

    @ViewChild('xQAEleRef') xQAEleRef: ElementRef;
    @ViewChild('fileInputEleRef') fileInputEleRef: ElementRef;

    // Model will be an object of either `file` and `removedFile` for singular, OR
    // `files` and `removedFiles` for multiple.
    // File inputs can NOT be set programmatically for security reasons, so
    // use `existingFiles` to set the existing model value.
    // Cannot remove / alter FileList files; so need to keep 2 lists:
    // one for existing files (which ARE removeable) and one for new files,
    // which are not.
    model: any = {
        file: null,
        files: [],
        removedFile: null,
        removedFiles: [],
        existingFiles: [],
    };
    multiple: boolean = false;
    extensions: string = ''; // Comma delimited
    mimeTypes: string = ''; // Comma delimited
    existingFiles: any[] = [];
    placeholder: string = '';
    label: string = '';
    disabled: boolean = false;
    required: boolean = false;
    validationMessages: any = {};
    formCtrl: any;
    maxFileSize: number = 10; // MB
    errorMode = false;
    dropzone = false;
    fixtureId: string = '';

    customDragText: string = '';
    customClickText: string = '';

    dragText: string = '';
    clickText: string = '';

    name: string = '';
    classesContainer: any = {};
    formCtrlSet: boolean = false;
    formControl: any = null;
    focused: boolean = false;

    // Copy of model.files, which is not updating in the UI on change..
    selectedFiles: any[] = [];
    file_input_id: string;

    constructor(
        private plLodash: PLLodashService,
        private plInputErrors: PLInputErrorsService,
        private plInputShared: PLInputSharedService,
    ) {
        this.file_input_id = 'file_input_' + `${Math.random()}`.substring(2);
    }

    // To enabled form validation.
    // http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    writeValue(value: any) {}
    propagateChange = (_: any) => {};
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    registerOnTouched() {}

    ngOnInit() {
        // Overwrite model no matter what as can not be set for file input type.
        this.initModel();
        this.setFormCtrl();
        this.init();
    }

    ngAfterViewInit() {
        // For (Cypress) tests, can not add to the file input directly, so need a back door
        // to set the file.
        if (this.fixtureId) {
            this.xQAEleRef.nativeElement.addEventListener(this.fixtureId, this.handleFixtureFile);
        }
    }

    ngOnChanges(changes: any) {
        if (!this.model) {
            this.initModel();
        }
        if (changes.existingFiles) {
            this.model.existingFiles = this.existingFiles;
        }
        this.init();
    }

    setExtensions() {
        if (!this.extensions) {
            this.extensions = PLInputMimeTypesService.getExtensionsFromMimeTypes(this.mimeTypes);
        }
    }

    handleFixtureFile = (event: any) => {
        let blob = event.detail.fileData;
        let file = new File([blob], event.detail.fileName);
        this.setModel([file]);
    };

    getValidations() {
        return {
            filerequired: this.required,
            maxfilesize: this.maxFileSize,
            fileextensions: this.extensions,
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
            'file',
            this.formControl
        );
        this.plInputErrors.setDisabled(this.formControl, this.disabled, true, this.model, this.getValidations());
    }

    init() {
        this.setExtensions();
        if (!this.plInputErrors.isModelEmpty(this.model)) {
            this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        }
        this.formClasses();
        this.dragText = this.customDragText || this.setDragText();
        this.clickText = this.customClickText || this.setClickText();
    }

    initModel() {
        if (this.existingFiles && !Array.isArray(this.existingFiles)) {
            this.existingFiles = [this.existingFiles];
        }
        this.model = {
            file: null,
            files: [],
            removedFile: null,
            removedFiles: [],
            existingFiles: this.existingFiles,
        };
    }

    setDragText() {
        return this.multiple ? 'Drag and drop files here' : 'Drag and drop a file here';
    }

    setClickText() {
        return 'Click to upload';
    }

    // File picker DOES prevent certain types but drag and drop does not.
    validateFileType(files: any) {
        let valid = true;
        // if (files && this.mimeTypes) {
        //     const mimeTypes = this.mimeTypes.split(',');
        //     for (let ff = 0; ff < files.length; ff++) {
        //         let file = files[ff];
        //         let atLeastOneMatch = false;
        //         for (let mm = 0; mm < mimeTypes.length; mm++) {
        //             if (file.type.indexOf(mimeTypes[mm]) > -1) {
        //                 atLeastOneMatch = true;
        //                 break;
        //             }
        //         }
        //         if (!atLeastOneMatch) {
        //             valid = false;
        //             console.warn(`${file.name} of type ${file.type} does not match ${this.mimeTypes}`);
        //         }
        //     }
        // }
        return valid;
    }

    onChangeInput(evt: any) {
        let files = evt.target && evt.target.files && evt.target.files ? evt.target.files : null;
        // special case validation of dropzone single file and single allowed extension
        const singleExtension = this.extensions.indexOf(',') === -1;
        if (this.dropzone && !this.multiple && singleExtension) {
            const filename = files && files.length && files[0].name;
            if (filename && filename.endsWith(`.${this.extensions}`)) {
                this.setModel(files);
            } else {
                console.log('onChangeInput', {filename, extensions: this.extensions})
                this.onValidateSingleFileExtension.emit({
                    filename,
                    allowedExtensions: this.extensions,
                })
            }
        }
        else if (files.length && this.validateFileType(files)) {
            this.setModel(files);
        }
    }

    setModel(files1: any) {
        if (this.multiple) {
            this.model.files = files1 ? files1 : [];
        } else {
            this.model.file = files1 ? files1[0] : null;
            this.model.files = this.model.file ? [this.model.file] : [];
        }
        this.updateModel();
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
    }

    updateModel() {
        const oldVal = this.model;
        // Copy over for UI to update (not sure why using model.files directly does not work..).
        this.selectedFiles = this.model.files;
        this.propagateChange(this.model);
        this.modelChange.emit(this.model);
        if (this.onChange) {
            this.onChange.emit({ model: this.model, oldVal: oldVal });
        }
        this.plInputErrors.reValidate(this.model, this.formControl, this.getValidations());
        this.formClasses();
    }

    removeExistingFile(file: any, index: number) {
        const indexRemoved = this.plLodash.findIndex(this.model.removedFiles, 'name', file.name);
        if (indexRemoved < 0) {
            this.model.removedFiles.push(file);
            if (!this.multiple) {
                this.model.removedFile = file;
            }
        }
        this.existingFiles.splice(index, 1);
        this.model.existingFiles = this.existingFiles;
        this.updateModel();
    }

    // Can not edit uploaded files; can only clear all.
    // removeFile(file: any, index: number) {
    //     if (this.multiple) {
    //         const indexRemoved = this.plLodash.findIndex(this.model.files, 'name', file.name);
    //         if (indexRemoved > -1) {
    //             // FileList, not an array, so no splice.
    //             this.model.files.splice(indexRemoved, 1);
    //         }
    //     } else {
    //         if (this.model.file && this.model.file.name && this.model.file.name === file.name) {
    //             this.model.file = null;
    //             this.model.files = [];
    //         }
    //     }
    //     this.updateModel();
    // }

    removeAllUploadedFiles() {
        if (this.multiple) {
            this.model.files = [];
        } else {
            this.model.file = null;
            this.model.files = [];
        }
        this.fileInputEleRef.nativeElement.value = '';
        this.updateModel();
    }
}
