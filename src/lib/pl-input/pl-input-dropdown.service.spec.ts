import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PLInputDropdownService } from './pl-input-dropdown.service';

@Component({
  template: `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                div.relative {
                	background-color: black;
                    position: relative;
                    top: 500px;
                    left: 0px;
                    width: 500px;
                    height: 500px;
                }
                div.absolute {
                	background-color: grey;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 500px;
                    height: 300px;
                }
            </style>
        </head>
        <body>
            <div class="relative">
                <div class="absolute">This is a mock dropdown</div>
            </div>
        </body>
    </html>`
})
class TestComponent{}

describe('PLInputDropdownService', function() {
    let comp: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [ TestComponent ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .createComponent(TestComponent);
        
        fixture.detectChanges(); 
        
        de = fixture.debugElement.query(By.css('div.absolute'));
        el = de.nativeElement;
    });

    beforeEach(() => {
        this.plInputDropdown = new PLInputDropdownService();
    });

    it("clickInRect - should return true since clicked within the element's boundaries", () => {
        expect(this.plInputDropdown.clickInRect({clientX: 100, clientY: 700}, el)).toEqual(true);
    });

    it("clickInRect - should return false since not clicked within the element's boundaries", () => {
        expect(this.plInputDropdown.clickInRect({clientX: 0, clientY: 0}, el)).toEqual(false);
    });

    // TODO - fails sporadically.
    // it("getCoords - should get the coordinates of the element", () => {
    //     const coords = {
    //         top: 571,
    //         bottom: 871,
    //         left: 10,
    //         right: 510,
    //         height: 300,
    //         width: 500
    //     }
    //     expect(this.plInputDropdown.getCoords(el)).toEqual(coords);
    // });

    // it("getCoords - should get the coordinates of the element where body isn't full height of window", () => {
    //     const coords = {
    //         top: 571,
    //         bottom: window.outerHeight,
    //         left: 10,
    //         right: 510,
    //         height: 100,
    //         width: 500
    //     }
    //     el.style.height = '100px';
    //     expect(this.plInputDropdown.getCoords(el, 'body')).toEqual(coords);
    // });

    // it("getPosition - should get the position of the element", () => {
    //     el.style.height = '100px';
    //     expect(this.plInputDropdown.getPosition(el, 'body', {bottom: 10, top:10})).toEqual({});
    // });

    // it("getPosition - should get the position of the element that is too low", () => {
    //     expect(this.plInputDropdown.getPosition(el, 'body', {bottom: 10, top:10})).toEqual({top: '-300px'});
    // });
});
