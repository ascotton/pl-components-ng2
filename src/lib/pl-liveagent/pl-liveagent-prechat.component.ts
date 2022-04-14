import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'pl-liveagent-prechat',
    templateUrl: './pl-liveagent-prechat.component.html',
    styleUrls: ['./pl-liveagent-prechat.component.less'],
})
export class PLLiveagentPrechatComponent {
    @Input('firstName') firstName: string = '';
    @Input('lastName') lastName: string = '';
    @Input('email') email: string = '';

    issue: string = '';
    formAction: string = '';
    formId: string = 'liveagentPrechatForm';
    hiddenFields: any = {
        'email': false,
        'firstName': false,
        'lastName': false
    };

    constructor(private location: Location) {}

    ngOnInit() {
        this.setFormAction();
        this.getUserData();
    }

    ngOnChanges() {
        this.getUserData();
    }

    setFormAction() {
        let endpoint = null;
        // https://live.presencelearning.com/liveagent/prechat/?endpoint=https%3A%2F%2F2sgmo.la1-c2-ia2.salesforceliveagent.com%2Fcontent%2Fs%2Fchat%3Flanguage%3Den_US%23deployment_id%3D57280000000CbGq%26org_id%3D00D80000000aMap%26button_id%3D57380000000GnQ2%26session_id%3Df799bdf5-907e-4eab-bccb-2f0947a66d34
        const locationPath = this.location.path();
        const posQuestionMark = locationPath.indexOf('?');
        if (posQuestionMark > -1) {
            const queryParamsString = locationPath.slice((posQuestionMark + 1), locationPath.length);
            const queryItems = queryParamsString.split('&');
            let queryParams = {};
            queryItems.forEach((queryItem: string) => {
                let keyValue = queryItem.split('=');
                queryParams[keyValue[0]] = keyValue[1];
            });
            if (queryParams['endpoint']) {
                endpoint = decodeURIComponent(queryParams['endpoint']);
                this.formAction = endpoint;
            }
        }
    }

    getUserData() {
        this.hiddenFields.firstName = this.firstName ? true : false;
        this.hiddenFields.lastName = this.lastName ? true : false;
        this.hiddenFields.email = this.email ? true : false;
    }

    preSubmitForm() {
        const formNameMap: any = {
            firstName: 'liveagent.prechat:contactFirstName',
            lastName: 'liveagent.prechat:contactLastName',
            email: 'liveagent.prechat:contactEmail',
            issue: 'liveagent.prechat:caseSubject',
        };
        const form: any = document.getElementById(this.formId);
        for (let key in formNameMap) {
            form[formNameMap[key]].value = this[key];
        }
        if (this.firstName && this.lastName && this.email && this.issue) {
            form.submit();
        }
    }
}