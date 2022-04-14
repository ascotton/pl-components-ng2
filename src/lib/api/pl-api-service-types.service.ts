import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiServiceTypesService {
    private serviceTypes: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('serviceTypes', params1).subscribe(
                (res: any) => {
                    this.serviceTypes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(serviceTypes1: any = null) {
        const serviceTypes = serviceTypes1 || this.serviceTypes;
        if (this.serviceTypes && this.serviceTypes.length) {
            return serviceTypes.map((item: any) => {
                return { value: item.uuid, label: item.long_name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, serviceTypes1: any[] = null) {
        const serviceTypes = serviceTypes1 || this.serviceTypes;
        const index = this.plLodash.findIndex(serviceTypes, key, keyValue);
        return index > -1 ? serviceTypes[index] : null;
    }

    getInfo(uuid: string) {
        return this.getFromKey('uuid', uuid);
    }

    formSelectOpts(opts: any) {
        return this.formOpts(opts);
    }

    getByProviderType(providerTypeCode: string) {
        const map = {
            mhp: 'bmh',
            ot: 'ot',
            slp: 'slt',
            sped: 'sped',
        };
        return this.getFromKey('code', map[providerTypeCode]);
    }
}
