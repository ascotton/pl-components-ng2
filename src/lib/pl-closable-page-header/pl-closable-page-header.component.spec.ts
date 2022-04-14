import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PLClosablePageHeaderComponent } from './pl-closable-page-header.component';
import { PLIconComponent } from '../pl-icon/pl-icon.component';

describe('PLClosablePageHeaderComponent', () => {
    let component: PLClosablePageHeaderComponent;
    let fixture: ComponentFixture<PLClosablePageHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PLClosablePageHeaderComponent, PLIconComponent],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PLClosablePageHeaderComponent);
            component = fixture.componentInstance;
        });
    }));

    it('should call callback function when close is clicked', async(() => {
        spyOn(component, 'close');
        const closeButton = fixture.debugElement.nativeElement.querySelector('button');
        closeButton.click();

        fixture.whenStable().then(() => {
            expect(component.close).toHaveBeenCalled();
        });
  }));

});
