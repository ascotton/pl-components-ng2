import { Injectable } from '@angular/core';

@Injectable()
export class PLFormatterService {
    constructor() {}

    commify(number: any) {
        let value = typeof number !== 'string' ? number.toString() : number;
        let pieces: any = [];
        let piece: string;
        for (let ii = value.length; ii > 0; ii = ii - 3) {
            piece = ii >= 3 ? value.slice(ii - 3, ii) : value.slice(0, ii);
            pieces.unshift(piece);
        }
        return pieces.join(',');
    }
}
