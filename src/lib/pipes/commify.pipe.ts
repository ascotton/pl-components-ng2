import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'commify' })
export class CommifyPipe implements PipeTransform {
    transform(number: any): string {

        // NOTE: jh.2019.02.08 - what is the case for this custom pipe?
        // see https://angular.io/api/common/DecimalPipe - e.g. {{value | number: '0.0-9' }}
        // changed the verbose implementation to use native number formatting, but this
        // seems extraneous given the existing framework support in DecimalPipe...
        const value = Number(number).toLocaleString("en-US", { maximumFractionDigits: 9 })
        if (value === 'NaN') {
            throw new Error('Value must be a number or a string representing a number.');
        }
        return value;
    }
}
