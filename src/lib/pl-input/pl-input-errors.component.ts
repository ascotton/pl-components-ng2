import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PLInputErrorsService } from './pl-input-errors.service';

@Component({
    selector: 'pl-input-errors',
    templateUrl: './pl-input-errors.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-errors.component.less'],
    inputs: ['name', 'messages', 'minlength', 'maxlength', 'min', 'max', 'zipcode', 'maxfilesize', 'fileextensions'],
})
export class PLInputErrorsComponent {
    @Output() onChange = new EventEmitter<any>();

    @Input('formCtrl') formCtrl: any;

    messages: any = {};
    name: string;
    minlength: number = null;
    maxlength: number = null;
    min: number = null;
    max: number = null;
    maxfilesize: number = null;
    fileextensions: string; // Comma delimited.

    formControl: any;

    private messagesDefault: any = {
        required: 'This is required',
        checkboxrequired: 'This is required',
        arrayrequired: 'This is required',
        filerequired: 'Please select a file',
        maxfilesize: 'This file is too large (max size is 30 MB)',
        fileextensions: 'Please use an accepted file type',
        minlength: 'Value is too short',
        maxlength: 'Value is too long',
        min: 'Please choose a larger value',
        max: 'Please choose a smaller value',
        pattern: 'Invalid characters!',
        number: 'Please only include numbers',
        email: 'Must be a valid email',
        url: 'Please enter a valid URL',
        tel: 'Please enter a valid phone number',
        zipcode: 'Please enter a 5- or 9-digit ZIP code',
    };
    private errors: any[] = [];

    constructor(private plInputErrors: PLInputErrorsService) {}

    ngOnInit() {
        this.setMessages();
        this.init();
    }

    ngOnChanges(changes: any) {
        if (changes.messages) {
            this.setMessages();
        }
        this.init();
    }

    init() {
        this.formControl = this.formCtrl.controls[this.name];
    }

    setMessages() {
        const messagesDefault = this.messagesDefault;
        if (this.minlength) {
            messagesDefault.minlength = `Please enter a value at least ${this.minlength} characters long`;
        }
        if (this.maxlength) {
            messagesDefault.maxlength = `Please enter a value with fewer than ${this.maxlength} characters`;
        }
        if (this.min || this.min === 0) {
            messagesDefault.min = `Value must be at least ${this.min}`;
        }
        if (this.max) {
            messagesDefault.max = `Value must be less than ${this.max}`;
        }
        if (this.maxfilesize) {
            messagesDefault.maxfilesize = `This file is too large (max size is ${this.maxfilesize} MB)`;
        }
        if (this.fileextensions) {
            let extensions = this.fileextensions.split(',').join(', ');
            messagesDefault.fileextensions = `Please use a file of one of these types: ${extensions}`;
        }
        this.messages = Object.assign({}, messagesDefault, this.messages);
    }
}
