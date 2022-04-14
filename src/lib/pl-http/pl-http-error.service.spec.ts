import { TestBed } from '@angular/core/testing';

import { PLUrlsService } from './pl-urls.service';

import { PLHttpErrorService } from './pl-http-error.service';

describe('PLHttpErrorService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLHttpErrorService,
                { provide: PLUrlsService, useClass: PLUrlsService },
            ]
        });
        this.plHttpError = TestBed.get(PLHttpErrorService);
        this.plUrls = TestBed.get(PLUrlsService);

        this.urls = {
            status: 'example.com/status',
            clients: 'example.com/clients',
            assumeLogin: 'example.com/assume-login',
            evaluations: 'example.com/evaluations',
            invoices: 'example.com/invoices',
        };
        this.plUrls.setUrlsDefaults(this.urls);
        this.plUrls.formUrls();
        this.messages = {
            'clients': [
                { code: 401, msg: 'You do not have access to these clients'}
            ],
            'evaluations/:uuid': [
                { code: 400, status: 'The evaluation can\'t be completed because it has appointments in the future',
                 msg: 'The evaluation can\'t be completed because it has appointments in the future'},
            ],
            'invoices/:uuid/retract': [
                { code: 403, msg: 'This invoice has already been processed and cannot be retracted.'},
            ],
        };
    });

    describe('setMessages', () => {
        it('should set messages', () => {
            const messages = this.messages;
            const newMessages = this.plHttpError.setMessages(messages);
            const expectMessages = {
                'clients': [
                    { code: 401, msg: 'You do not have access to these clients'}
                ],
                'evaluations\\\/[a-z\\d-]*': [
                    { code: 400, status: 'The evaluation can\'t be completed because it has appointments in the future',
                     msg: 'The evaluation can\'t be completed because it has appointments in the future'},
                ],
                'invoices\\\/[a-z\\d-]*\\\/retract': [
                    { code: 403, msg: 'This invoice has already been processed and cannot be retracted.'},
                ],
            };
            expect(newMessages).toEqual(expectMessages);
        });
    });

    describe('get', () => {
        it('should get a route message', () => {
            this.plHttpError.setMessages(this.messages);
            const message = this.plHttpError.get('clients', 401, {});
            expect(message).toBe('You do not have access to these clients');
        });

        it('should get a generic message', () => {
            this.plHttpError.setMessages(this.messages);
            const message = this.plHttpError.get('badroute', 401, {});
            expect(message).toBe('Unauthorized. Please make sure you are logged in and have privileges to complete this action.');
        });
    });
});