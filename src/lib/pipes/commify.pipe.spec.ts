import { TestBed, async } from '@angular/core/testing';

import { CommifyPipe } from './commify.pipe';

describe('CommifyPipe', () => {
    it('should add commas to an integer', () => {
        const pipe = new CommifyPipe();
        expect(pipe.transform(1234)).toEqual('1,234');
    });

    it('should add commas to a float', () => {
        const pipe = new CommifyPipe();
        expect(pipe.transform(1234.5678)).toEqual('1,234.5678');
    });

    it("should add commas to a string that's an integer", () => {
        const pipe = new CommifyPipe();
        expect(pipe.transform('1234')).toEqual('1,234');
    });

    it("should add commas to a string that's a float", () => {
        const pipe = new CommifyPipe();
        expect(pipe.transform('1234.5678')).toEqual('1,234.5678');
    });

    it("should fail if the string isn't a number", () => {
        const pipe = new CommifyPipe();
        let carrotFn = function() {
            pipe.transform('carrot');
        };
        expect(carrotFn).toThrow();
    });
});
