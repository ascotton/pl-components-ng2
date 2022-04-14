import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApolloStub {

    mockedResponses = {}

    constructor() {}

    emptyMockedResponses() {
        this.mockedResponses = {};
    }

    addMockedResponse(xName: string, successResponse: any = null, errorResponse: any = null) {
        this.mockedResponses[xName] = {
            success: successResponse,
            error: errorResponse,
        };
    }

    handleResponse(observer: any, params: any) {
        if (params.xName && this.mockedResponses[params.xName]) {
            const response = this.mockedResponses[params.xName];
            if (response.success) {
                observer.next(response.success);
            } else {
                observer.error(response.error);
            }
        } else {
            observer.next(params);
        }
    }

    watchQuery(params: any) {
        return {
            valueChanges: new Observable((observer: any) => {
                this.handleResponse(observer, params);
            }),
        };
    }

    mutate(params: any) {
        return new Observable((observer: any) => {
            this.handleResponse(observer, params);
        });
    }

    getClient() {
        return {
            resetStore: function() {}
        };
    }
}