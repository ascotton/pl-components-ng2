import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiEthnicitiesService {
    private ethnicities: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('ethnicities', params1).subscribe(
                (res: any) => {
                    this.ethnicities = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(ethnicities1: any = null) {
        const ethnicities = ethnicities1 || this.ethnicities;
        if (this.ethnicities && this.ethnicities.length) {
            return ethnicities.map((item: any) => {
                return { value: item.uuid, label: item.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, ethnicities1: any[] = null) {
        const ethnicities = ethnicities1 || this.ethnicities;
        const index = this.plLodash.findIndex(ethnicities, key, keyValue);
        return index > -1 ? ethnicities[index] : null;
    }
}
