import { Injectable } from '@angular/core';


import { PLUrlsService } from './pl-urls.service';

@Injectable({ providedIn: 'root' })
export class PLHttpErrorService {
    messages: any = {};

    constructor(private plUrls: PLUrlsService) {}

    private formRegExMessages(messages: any) {
        const messagesRegEx: any = {};
        let urlRegEx: any;
        for (let url in messages) {
            urlRegEx = url.replace(/\//g, '\\/').replace(/:uuid/g, '[a-z\\d-]*');
            messagesRegEx[urlRegEx] = messages[url];
        }
        return messagesRegEx;
    }

    setMessages(messages: any) {
        this.messages = this.formRegExMessages(messages);
        return this.messages;
    }

    // getMessages() {
    //     return this.messages;
    // }

    private formMessage(messageObj: any, err: any) {
        if (messageObj.fxn) {
            return messageObj.fxn(err);
        } else if (messageObj.msg) {
            return messageObj.msg;
        }
        return null;
    }

    private getRouteMessage(route: any, code: number, err: any) {
        let index: number;
        for (let urlRegEx in this.messages) {
            if (route.match(urlRegEx)) {
                index = -1;
                const messages = this.messages[urlRegEx];
                if (typeof(messages) === 'function') {
                    return messages(err);
                } else {
                    for (let ii = 0; ii < messages.length; ii++) {
                        if (
                            this.messages[urlRegEx][ii].code === code &&
                            (!this.messages[urlRegEx][ii].status ||
                                (err.data &&
                                    err.data.status &&
                                    err.data.status[0] &&
                                    err.data.status[0] === this.messages[urlRegEx][ii].status))
                        ) {
                            index = ii;
                            break;
                        }
                    }
                    if (index > -1) {
                        return this.formMessage(this.messages[urlRegEx][index], err);
                    }
                }
            }
        }
        return null;
    }

    get(route: any, code: number, err: any) {
        let message = this.getRouteMessage(route, code, err);
        if (!message) {
            message = this.getGeneric(code, err);
        }
        return message;
    }

    getGeneric(code: number, err: any) {
        if (code === 403 || code === 401) {
            return 'Unauthorized. Please make sure you are logged in and have ' + 'privileges to complete this action.';
        }
        return (
            'Oops, something went wrong. Please try again. If the problem ' + 'persists please contact us for support.'
        );
    }
}
