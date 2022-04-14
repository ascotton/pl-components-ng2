import { TestBed, async } from '@angular/core/testing';

import { PLStylesService } from './pl-styles.service';

describe('PLStylesService', function() {

        beforeEach(() => {
            this.plStyles = new PLStylesService();
        });

        it('retrieves colors', () => {
            expect(this.plStyles.getColorForName('orange')).toEqual('ed8000');
            expect(this.plStyles.getColorForName('red')).toEqual('D0021B');
            expect(this.plStyles.getColorForName('redXYZ')).toBeUndefined();
        });
});

