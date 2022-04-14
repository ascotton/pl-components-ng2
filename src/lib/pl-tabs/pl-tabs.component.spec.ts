import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';

import { PLTabsComponent } from './pl-tabs.component';
import { PLLinkService } from '../pl-link/pl-link.service';
import { PLBrowserService } from 'lib/pl-browser';

class RouterStub {
    events = new Observable(() => {});
    navigateByUrl(url: string) {
        return url;
    }
}

class PLLinkStub {}

class PLBrowserServiceStub {}

describe('PLTabsComponent', () => {
    let comp: PLTabsComponent;
    let fixture: ComponentFixture<PLTabsComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [PLTabsComponent],
                providers: [
                    { provide: PLLinkService, useClass: PLLinkStub },
                    { provide: Router, useClass: RouterStub },
                    { provide: PLBrowserService, useClass: PLBrowserServiceStub },
                ],
                schemas: [NO_ERRORS_SCHEMA],
            })
                .compileComponents()
                .then(() => {
                    fixture = TestBed.createComponent(PLTabsComponent);
                    comp = fixture.componentInstance;
                });
        }),
    );

    it('ngOnInit - should initialize an empty tabs list', () => {
        fixture.detectChanges();
        expect(comp.tabs).toEqual([]);
    });

    it('ngOnChanges - should update a tabs list with changes', () => {
        comp.tabs = [
            {
                classes: '',
                classesLink: 'test_link1',
            },
            {
                classes: 'link2',
                classesLink: 'test_link2',
            },
        ];
        const tabs2 = [
            {
                classes: {},
                classesLink: 'test_link1',
            },
            {
                classes: 'link2',
                classesLink: 'test_link2',
            },
        ];
        // tslint:disable-next-line: no-life-cycle-call
        comp.ngOnChanges();
        expect(comp.tabs).toEqual(tabs2);
    });

    it('updateClass - should update the class links of the tabs', () => {
        comp.tabs = [
            {
                classes: 'link1',
                classesLink: 'test_link1',
            },
            {
                classes: 'link2',
                classesLink: '',
            },
        ];
        const tabs2 = [
            {
                classes: 'link1',
                classesLink: 'test_link1',
            },
            {
                classes: 'link2',
                classesLink: {
                    'padding-tb': true,
                    'link-unstyled': true,
                    'link-no-color': true,
                },
            },
        ];
        comp.updateClass();
        expect(comp.tabs).toEqual(tabs2);
    });
});
