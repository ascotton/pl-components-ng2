/* tslint:disable: no-life-cycle-call */
/*
  Note: Angular testing guide encourages calling life-cycle functions directly.
  See https://angular.io/guide/testing
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLModalService } from './pl-modal.service';
import { PLModalComponent } from './pl-modal.component';

describe('PLModalComponent', () => {
    let comp: PLModalComponent;
    let fixture: ComponentFixture<PLModalComponent>;
    let modalServiceStub = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PLModalComponent],
            providers: [PLModalService],
        });
        fixture = TestBed.createComponent(PLModalComponent);
        modalServiceStub = fixture.debugElement.injector.get(PLModalService);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('ngOnInit - should initialize the modal', () => {
        comp.ngAfterViewInit();
        expect(comp.classesCont.visible).toEqual(false);
    });

    it('show - should show the modal', () => {
        comp.show();
        expect(comp.classesCont.visible).toEqual(true);
    });

    it('hide - should hide the modal', () => {
        comp.hide();
        expect(comp.classesCont.visible).toEqual(false);
    });

    it('clickBackground - should hide the modal from the audience', () => {
        spyOn(comp.plModalContent.nativeElement, 'contains').and.returnValue(false);
        spyOn(comp.plModalContentWrapper.nativeElement, 'contains').and.returnValue(true);

        const eventStub = new Event('test');
        eventStub.initEvent('click', true, true);
        document.body.dispatchEvent(eventStub);

        comp.show();
        comp.clickBackground(eventStub);

        expect(comp.classesCont.visible).toEqual(false);
    });

    it('clickBackground - should continue to display the modal', () => {
        const eventStub = new Event('event');

        comp.show();
        comp.clickBackground(eventStub);

        expect(comp.classesCont.visible).toEqual(true);
    });
});
