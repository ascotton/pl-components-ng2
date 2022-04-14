import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLAppNavComponent } from './pl-app-nav.component';

describe('PLAppNavComponent', () => {
    let comp: PLAppNavComponent;
    let fixture: ComponentFixture<PLAppNavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PLAppNavComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PLAppNavComponent);
        comp = fixture.componentInstance;
    });

    xit('ngOnInit - should initialize the app navigator', () => {
        comp.ngOnInit();
        const testLogo = Object.assign(
            {},
            {
                href: '/home',
                svg: 'logo-color',
                width: 134,
                height: 22,
                verticalAlign: '-5px',
            },
            comp.logo
        );
        expect(comp.logo).toEqual(testLogo);
        expect(comp.links.page).toEqual(comp.pageLinks);
        expect(comp.links.app).toEqual(comp.appLinks);
        expect(comp.links.support).toEqual(comp.supportLinks);
        expect(comp.links.menu).toEqual(comp.userMenuLinks);
    });

    xit('ngOnChanges - should initialize the app navigator with changes', () => {
        comp.pageLinks = ['test_links'];
        const change = { prop: new SimpleChange([], ['test_links'], true) };
        comp.ngOnChanges(change);
        expect(comp.links.page).toEqual(['test_links']);
    });

    it('getMenuItemClass - should return the class of the item', () => {
        let itemMock = Object.assign({}, { class: 'classMock' });
        expect(comp.getMenuItemClass(itemMock)).toEqual('classMock');
    });

    it('getMenuItemClass - should return an empty string when item class has no value', () => {
        let itemMock = Object.assign({}, { class: null });
        expect(comp.getMenuItemClass(itemMock)).toEqual('');
    });

    it('toggleSidebar - should hide the sidebar', () => {
        comp.sidebarVisible = true;
        comp.toggleSidebar();
        expect(comp.sidebarVisible).toEqual(false);
    });

    it('setSidebarStyles - should set the style of the sidebar to the visible styles', () => {
        comp.sidebarVisible = true;
        comp.toggleSidebar();
        comp.setSidebarStyles();
        expect(comp.stylesSidebar).toEqual(comp.sidebarVisibleStyles);
    });

    it('setSidebarStyles - should set the style of the sidebar to the hidden styles', () => {
        comp.sidebarVisible = false;
        comp.toggleSidebar();
        comp.setSidebarStyles();
        expect(comp.stylesSidebar).toEqual(comp.sidebarHiddenStyles);
    });

    xit('onResize - should resize the left sidebar', () => {
        comp.sidebarSide = 'left';
        comp.onResize();
        expect(comp.sidebarHiddenStyles['left']).toEqual(`-200px`);
        expect(comp.sidebarVisibleStyles['left']).toEqual(`0px`);
    });

    xit('onResize - should resize the right sidebar', () => {
        comp.sidebarSide = 'right';
        comp.onResize(1050);
        expect(comp.sidebarHiddenStyles['left']).toEqual(`1050px`);
        expect(comp.sidebarVisibleStyles['left']).toEqual(`850px`);
    });
});
