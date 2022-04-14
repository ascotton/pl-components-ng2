import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiContactTypesService {
    private contactTypes: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('contactTypes', params1).subscribe(
                (res: any) => {
                    this.contactTypes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(contactTypes1: any = null) {
        const contactTypes = contactTypes1 || this.contactTypes;
        if (this.contactTypes && this.contactTypes.length) {
            return contactTypes.map((contactType: any) => {
                return { value: contactType.uuid, label: contactType.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, contactTypes1: any[] = null) {
        const contactTypes = contactTypes1 || this.contactTypes;
        const index = this.plLodash.findIndex(contactTypes, key, keyValue);
        return index > -1 ? contactTypes[index] : null;
    }

    getNameFromKey(key: string, keyValue: any, contactTypes1: any[] = null) {
        const obj = this.getFromKey(key, keyValue, contactTypes1);
        return obj && obj.name ? obj.name : '';
    }
}
