import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiBillingCodesService {
    private billingCodes: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('billingCodes', params1).subscribe(
                (res: any) => {
                    this.billingCodes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(billingCodes1: any = null) {
        const billingCodes = billingCodes1 || this.billingCodes;
        if (this.billingCodes && this.billingCodes.length) {
            return billingCodes.map((item: any) => {
                return { value: item.uuid, label: item.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, billingCodes1: any[] = null) {
        const billingCodes = billingCodes1 || this.billingCodes;
        const index = this.plLodash.findIndex(billingCodes, key, keyValue);
        return index > -1 ? billingCodes[index] : null;
    }
}
