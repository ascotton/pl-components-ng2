import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpStub {

    mockedResponses = {}

    constructor() {}

    emptyMockedResponses() {
        this.mockedResponses = {};
    }

    addMockedResponse(xName, successResponse = null, errorResponse = null) {
        this.mockedResponses[xName] = {
            success: successResponse,
            error: errorResponse,
        };
    }

    handleResponse(observer, method, url, params) {
        const headerXName = params.headers.get('xName');
        if (headerXName) {
            const response = this.mockedResponses[headerXName];
            if (response.success) {
                observer.next(response.success);
            } else {
                observer.error(response.error);
            }
        } else {
            observer.next(params);
        }
    }

    request(method, url, options) {
        return new Observable((observer: any) => {
            this.handleResponse(observer, method, url, options);
        });
    }
}