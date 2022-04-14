import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable()
export class PLGraphQLErrorService {
    messages: any = {};

    constructor() {}

    get(response: any) {
        const message = this.getGeneric(response);
        return message;
    }

    getGeneric(response: any) {
        let errorDetails = [];
        if (response.errors) {
            for (let ii = 0; ii < response.errors.length; ii++) {
                if (response.errors[ii].code) {
                    let code = response.errors[ii].code;
                    if (code === 'authentication_failed' || code === 'not_authenticated') {
                        return (
                            'Unauthorized. Please make sure you are logged in and have ' +
                            'privileges to complete this action.'
                        );
                    } else {
                        errorDetails.push(code);
                    }
                }
                if (response.errors[ii].message) {
                    return response.errors[ii].message;
                }
            }
        }
        let message = '';
        if (errorDetails.length > 0) {
            message += errorDetails.join(', ') + ' ';
        }
        message += 'Oops, something went wrong. Please try again. If the problem ' + 'persists please contact us for support.';
        return (
            message
        );
    }
}
