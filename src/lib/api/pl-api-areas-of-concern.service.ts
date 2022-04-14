import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiAreasOfConcernService {
    private areasOfConcern: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('areasOfConcern', params1).subscribe(
                (res: any) => {
                    this.areasOfConcern = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(areasOfConcern1: any = null) {
        const areasOfConcern = areasOfConcern1 || this.areasOfConcern;
        if (this.areasOfConcern && this.areasOfConcern.length) {
            return areasOfConcern.map((item: any) => {
                return { value: item.uuid, label: item.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, areasOfConcern1: any[] = null) {
        const areasOfConcern = areasOfConcern1 || this.areasOfConcern;
        const index = this.plLodash.findIndex(areasOfConcern, key, keyValue);
        return index > -1 ? areasOfConcern[index] : null;
    }

    getNamesFromIds(uuids: string[], areasOfConcern1: any[] = null) {
        const areasOfConcern = areasOfConcern1 || this.areasOfConcern;
        const names: string[] = [];
        if (uuids && uuids.length) {
            let index: number;
            uuids.forEach((uuid: string) => {
                index = this.plLodash.findIndex(areasOfConcern, 'uuid', uuid);
                if (index > -1) {
                    names.push(areasOfConcern[index].name);
                }
            });
        }
        return names;
    }
}
