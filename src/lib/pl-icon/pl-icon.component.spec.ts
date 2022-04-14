import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PLIconComponent } from './pl-icon.component';

describe('PLIconComponent', () => {
    let comp: PLIconComponent;
    let fixture: ComponentFixture<PLIconComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PLIconComponent],
        });
        fixture = TestBed.createComponent(PLIconComponent);
        comp = fixture.componentInstance;
    });

    it('ngOnInit - should initialize the icon with the height the same as the width', () => {
        comp.ngOnInit();
        expect(comp.height).toEqual(comp.width);
    });

    it('ngOnChanges - should update the icon with new svg', () => {
        comp.svg = 'alert';
        fixture.detectChanges();
        comp.ngOnChanges(comp);
        expect(comp.svg).toEqual('alert');
    });

    it('ngOnChanges - should update the icon with new scale', () => {
        comp.scale = -1;
        fixture.detectChanges();
        comp.ngOnChanges(comp);
        expect(comp.verticalAlign).toEqual('');
    });
});
