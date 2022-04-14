import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiProviderTypesService {
    private providerTypes: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('providerTypes', params1).subscribe(
                (res: any) => {
                    this.providerTypes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    getFromKey(key: string, keyValue: any, providerTypes1: any[] = null) {
        const providerTypes = providerTypes1 || this.providerTypes;
        return this.plLodash.getItemFromKey(providerTypes, key, keyValue);
    }

    getValueFromKey(key: string, keyValue: any, valueKey: string, providerTypes1: any[] = null) {
        const providerTypes = providerTypes1 || this.providerTypes;
        return this.plLodash.getItemValueFromKey(providerTypes, key, keyValue, valueKey);
    }
}
