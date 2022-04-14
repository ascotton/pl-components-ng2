import { TestBed, async } from '@angular/core/testing';

import { PLFormatterService } from './pl-formatter.service';

describe('PLFormatterService', () => {
    let service: PLFormatterService;

    describe('commify', () => {
        beforeEach(() => {
            service = new PLFormatterService();
        });

        it('should add commas to an integer', () => {
            expect(service.commify(1234)).toEqual('1,234');
        });

        it('should add commas to a string that\'s an integer', () => {
            expect(service.commify('1234')).toEqual('1,234');
        });
    });
});
