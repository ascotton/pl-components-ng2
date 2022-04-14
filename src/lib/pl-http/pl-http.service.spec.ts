import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';

import { PLUrlsService } from './pl-urls.service';
import { PLHttpAuthService } from './pl-http-auth.service';
import { PLHttpErrorService } from './pl-http-error.service';
import { PLLodashService } from '../pl-lodash';
import { PLToastService } from '../pl-toast';
import { PLWindowService } from '../pl-window';

import { PLHttpService } from './pl-http.service';

import { HttpStub } from '../../testing/http-stub';
import { PLToastStub } from '../../testing/pl-toast-stub';

describe('PLHttpService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLHttpService,
                { provide: HttpClient, useClass: HttpStub },
                { provide: PLUrlsService, useClass: PLUrlsService },
                { provide: PLHttpAuthService, useClass: PLHttpAuthService },
                { provide: PLHttpErrorService, useClass: PLHttpErrorService },
                { provide: PLToastService, useClass: PLToastStub },
                { provide: PLLodashService, useClass: PLLodashService },
                // pl-window is a dependency of pl-http-auth
                { provide: PLWindowService, useClass: PLWindowService },
            ]
        });
        this.plHttp = TestBed.get(PLHttpService);
        this.http = TestBed.get(HttpClient);
        this.plUrls = TestBed.get(PLUrlsService);

        const urls = {
            clients: 'example.com/clients',
        };
        this.plUrls.setUrlsDefaults(urls);
        this.plUrls.formUrls();
    });

    describe('save', () => {
        it('should save with success', (done) => {
            const xName = 'testSuccessSave';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, response);
            this.plHttp.save('clients', {client: { id: '1', firstName: 'Joe' } }, null, { xName: xName })
                .subscribe((res: any) => {
                    expect(res).toEqual(response);
                    done();
                });
        });

        it('should save using patch with success', (done) => {
            const xName = 'testSuccessPatchSave';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, response);
            this.plHttp.save('clients', {uuid: '1' }, null, { xName: xName })
                .subscribe((res: any) => {
                    expect(res).toEqual(response);
                    done();
                });
        });
    });

    describe('get', () => {
        it('should get with success', (done) => {
            const xName = 'testSuccessGet';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, response);
            this.plHttp.get(null, {}, 'clients?id=1', { xName: xName })
                .subscribe((res: any) => {
                    expect(res).toEqual(response);
                    done();
                });
        });

        it('should get with error', (done) => {
            const xName = 'testErrorGet';
            const errResponse = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, null, errResponse);
            this.plHttp.get('clients', {client: { id: '1', firstName: 'Joe' } }, null, { xName: xName })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(errResponse);
                    done();
                });
        });

        it('should get and suppress error', (done) => {
            const xName = 'testErrorSuppressGet';
            const errResponse = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, null, errResponse);
            this.plHttp.get('clients', {client: { id: '1', firstName: 'Joe' } }, null, { xName: xName, suppressError: true })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(errResponse);
                    done();
                });
        });
    });

    describe('delete', () => {
        it('should delete with success', (done) => {
            const xName = 'testSuccessDelete';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, response);
            this.plHttp.delete('clients', {client: { id: '1', firstName: 'Joe' } }, null, { xName: xName })
                .subscribe((res) => {
                    expect(res).toEqual(response);
                    done();
                });
        });
    });

    describe('put', () => {
        it('should put with success', (done) => {
            const xName = 'testSuccessPut';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.http.addMockedResponse(xName, response);
            this.plHttp.put('clients', {client: { id: '1', firstName: 'Joe' } }, null, { xName: xName })
                .subscribe((res) => {
                    expect(res).toEqual(response);
                    done();
                });
        });
    });
});