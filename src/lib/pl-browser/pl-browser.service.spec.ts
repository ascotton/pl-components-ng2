import { TestBed, async } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { PLBrowserService } from './pl-browser.service';
import { PLHttpService } from '../pl-http/pl-http.service';
import { PLLinkService } from '../pl-link/pl-link.service';

import { PLHttpStub } from '../../testing/pl-http-stub';
import { PLLinkStub } from '../../testing/pl-link-stub';
import { LocationStub } from '../../testing/location-stub';
import { TitleStub } from '../../testing/title-stub';

describe('PLBrowserService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLBrowserService,
                { provide: Title, useClass: TitleStub },
                { provide: Location, useClass: LocationStub },
                { provide: PLHttpService, useClass: PLHttpStub },
                { provide: PLLinkService, useClass: PLLinkStub },
            ]
        });
        this.plBrowserService = TestBed.get(PLBrowserService);
        this.locationService = TestBed.get(Location);
        this.titleService = TestBed.get(Title);
    });

    describe('setTitleSuffix', () => {
        it('should set the title suffix', () => {
            const newSuffix = 'new suffix';
            this.plBrowserService.setTitleSuffix(newSuffix);
            expect(this.plBrowserService.titleSuffix).toBe(newSuffix);
        });
    });

    describe('setTitle', () => {
        it('should set the title', () => {
            const newSuffix = 'suffix';
            this.plBrowserService.setTitleSuffix(newSuffix);
            const titlePart = 'new title part';
            this.plBrowserService.setTitle(titlePart);
            expect(this.titleService.getTitle()).toBe(`${titlePart} - ${newSuffix}`);
        });

        it('should skip if SKIPHISTORY', () => {
            const newSuffix = 'suffix';
            this.plBrowserService.setTitleSuffix(newSuffix);
            const titlePart = 'SKIPHISTORY';
            this.plBrowserService.setTitle(titlePart, { updateLinkState: true });
            expect(this.titleService.getTitle()).toBe(`${newSuffix}`);
        });

        it('should update the link state', () => {
            const titlePart = 'new title part';
            this.plBrowserService.setTitle(titlePart, { updateLinkState: true });
        });

        it('should add unique link state', () => {
            const titlePart = 'new title part';
            this.plBrowserService.setTitle(titlePart, { addLinkStateIfUnique: true });
        });
    });

    describe('getSubRoute', () => {
        it ('should get a sub route', () => {
            this.locationService.setPath('http://example.com/sub/path?p1=yes&p2=no');
            const subRoute = this.plBrowserService.getSubRoute();
            expect(subRoute).toBe('path');
        });
    });

    describe('detectBrowser', () => {
        const emptyEnvironment = {
            document: {},
            navigator: {},
            opr: undefined,
            window: {},
        };

        describe('when run in test host environment', () => {
            // Typescript won't allow referencing opr like window or document.
            const testEnvironment = { window, document, opr: undefined, navigator };

            /**
             * These should pass until Karma switches test hosts to a different browser.
             */
            it('should detect Chrome as test host', () => {
                const browser = this.plBrowserService.detectBrowser(testEnvironment);

                expect(browser.chrome).toBe(true);
            });

            /**
             * Sanity check that following detection strategies aren't false positives.
             */
            it('should not detect Chrome alternatives', () => {
                const browser = this.plBrowserService.detectBrowser(testEnvironment);

                expect(browser.opera).toBe(false);
                expect(browser.firefox).toBe(false);
                expect(browser.ie).toBe(false);
            });
        });

        it('should detect Chrome based on mocked globals', () => {
            const environment = {
                ...emptyEnvironment,
                navigator: {
                    // Lifted from Chrome
                    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
                    vendor: 'Google Inc.',
                },
            };

            const browser = this.plBrowserService.detectBrowser(environment);

            expect(browser.chrome).toBe(true);
        });

        it('should detect opera', () => {
            const environment = {
                ...emptyEnvironment,
                opr: {
                    addons: true
                },
                window: {
                    opr: true,
                    opera: true,
                }
            }

            const browser = this.plBrowserService.detectBrowser(environment);

            expect(browser.opera).toBe(true);
        });

        it('should detect Firefox', () => {
            const environment = {
                ...emptyEnvironment,
                navigator: {
                    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0',
                }
            }

            const browser = this.plBrowserService.detectBrowser(environment);

            expect(browser.firefox).toBe(true);
        });

        it('should detect IE', () => {
            const environment = {
                ...emptyEnvironment,
                document: {
                    documentMode: true,
                }
            }

            const browser = this.plBrowserService.detectBrowser(environment);

            expect(browser.ie).toBe(true);
        });
    });

    describe('isSupported', () => {
        /*
            Karma runs in Chrome, so we have to rely on mocked responses from
            detectBrowser to determine if isSupported() returns true under
            the right circumstances. Testing whether browser are actually tested
            should happen in tests for detectBrowser.
        */
        it('should support chrome', () => {
            const detectedBrowsers = {
                opera: false,
                firefox: false,
                safari: false,
                chrome: true,
            };

            spyOn(this.plBrowserService, 'detectBrowser').and.returnValue(detectedBrowsers);

            expect(this.plBrowserService.isSupported()).toBe(true);
        });

        it('should support Firefox', () => {
            const detectedBrowsers = {
                opera: false,
                firefox: true,
                safari: false,
                chrome: false,
            };

            spyOn(this.plBrowserService, 'detectBrowser').and.returnValue(detectedBrowsers);

            expect(this.plBrowserService.isSupported()).toBe(true);
        });

        it('should not support ie', () => {
            const detectedBrowsers = {
                ie: true,
                firefox: false,
                safari: false,
                chrome: false,
            };

            spyOn(this.plBrowserService, 'detectBrowser').and.returnValue(detectedBrowsers);

            expect(this.plBrowserService.isSupported()).toBe(false);
        });
    });
});
