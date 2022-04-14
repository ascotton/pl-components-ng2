import { TestBed } from '@angular/core/testing';

import { PLUrlsService } from './pl-urls.service';
import { PLWindowService } from '../pl-window';

import { PLHttpAuthService } from './pl-http-auth.service';

import { PLWindowStub } from '../../testing/pl-window-stub';

describe('PLHttpAuthService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLHttpAuthService,
                { provide: PLUrlsService, useClass: PLUrlsService },
                { provide: PLWindowService, useClass: PLWindowStub },
            ]
        });
        this.plHttpAuth = TestBed.get(PLHttpAuthService);
        this.plUrls = TestBed.get(PLUrlsService);

        this.urls = {
            status: 'example.com/status',
            clients: 'example.com/clients',
            assumeLogin: 'example.com/assume-login',
        };
        this.plUrls.setUrlsDefaults(this.urls);
        this.plUrls.formUrls();
    });

    this.setToken = (response1 = {}) => {
        const response = Object.assign({
            token: 'token1',
        }, response1);
        const token = this.plHttpAuth.getToken(response, this.urls.status);
        return token;
    };

    describe('getToken', () => {
        it('should get a token from a response', () => {
            const response = {
                token: 'token1',
            };
            const token = this.setToken(response);
            expect(token).toBe(response.token);
        });

        it('should get an empty string if no token', () => {
            const response = {
                nonToken: 'token2',
            };
            const token = this.plHttpAuth.getToken(response, this.urls.status);
            expect(token).toBe('');
        });
    });

    describe('addToken', () => {
        it('should add a token', () => {
            // First need to add a token.
            const token = this.setToken();
            const newHeaders = this.plHttpAuth.addToken(this.urls.clients, {});
            expect(newHeaders.headers.get('Authorization')).toBe(`JWT ${token}`);
        });
    });

    describe('assumeLogin', () => {
        it('should redirect', () => {
            this.plHttpAuth.assumeLogin('some@email.com');
        });
    });

    describe('releaseLogin', () => {
        it('should redirect', () => {
            this.plHttpAuth.releaseLogin();
        });
    });

    describe('login', () => {
        it('should redirect', () => {
            this.plHttpAuth.login();
        });
    });

    describe('logout', () => {
        it('should redirect', () => {
            this.plHttpAuth.logout();
        });
    });

    describe('shouldRetry', () => {
        it('should retry', () => {
            const shouldRetry = this.plHttpAuth.shouldRetry({ status: 401 }, 0, this.urls.clients);
            expect(shouldRetry).toBe(true);
        });

        it('should not retry', () => {
            const shouldRetry = this.plHttpAuth.shouldRetry({ status: 200 }, 0, this.urls.clients);
            expect(shouldRetry).toBe(false);
        });
    });
});