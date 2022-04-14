import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PLInputModule } from './index';
import { PLInputTextComponent } from './pl-input-text.component';

describe('PLInputTextComponent', () => {
    let component: PLInputTextComponent;
    let fixture: ComponentFixture<PLInputTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PLInputModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PLInputTextComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Input Types Number', () => {
        beforeEach(() => {
            component.type = 'number';
        });

        it('should allow negative/positive/decimal numbers', () => {
            const numbers = ['-9.5', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '9.5'];
            const mockedObj = {
                key: '',
                preventDefault: () => { },
            };
            const preventDefaultSpy = spyOn(mockedObj, 'preventDefault');

            numbers.forEach((number) => {
                mockedObj.key = number;
                component.change(mockedObj);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });
        });

        it('should allow specified key codes', () => {
            const keyCodes = [8, 9, 46, 110, 189, 190];
            const mockedObj = {
                keyCode: 0,
                preventDefault: () => { },
            };
            const preventDefaultSpy = spyOn(mockedObj, 'preventDefault');

            keyCodes.forEach((code) => {
                mockedObj.keyCode = code;
                component.change(mockedObj);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });
        });

        it('should allow key combinations', () => {
            const keyCombs = [65, 67, 86, 88]; // Ctrl/Command A, C, V, X
            const mockedObj = {
                keyCode: 0,
                ctrlKey: true,
                metaKey: true,
                preventDefault: () => { },
            };
            const preventDefaultSpy = spyOn(mockedObj, 'preventDefault');

            keyCombs.forEach((code) => {
                mockedObj.keyCode = code;
                component.change(mockedObj);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });
        });

        it('should not allow alphabet characters', () => {
            let code = 65;
            const mockedObj = {
                keyCode: code,
                preventDefault: () => { },
            };

            const preventDefaultSpy = spyOn(mockedObj, 'preventDefault');

            if (code > 64 && code < 91) {
                mockedObj.keyCode = code;
                component.change(mockedObj);

                expect(preventDefaultSpy).toHaveBeenCalled();

                code++;
            }
        });

        it('should return false on empty event', () => {
            const bubledEvt = component.change({});
            expect(bubledEvt).not.toBeTruthy();
        });
    });
});
