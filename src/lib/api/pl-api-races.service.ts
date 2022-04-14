import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiRacesService {
    private races: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('races', params1).subscribe(
                (res: any) => {
                    this.races = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(races1: any = null) {
        const races = races1 || this.races;
        if (this.races && this.races.length) {
            return races.map((item: any) => {
                return { value: item.uuid, label: item.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, races1: any[] = null) {
        const races = races1 || this.races;
        const index = this.plLodash.findIndex(races, key, keyValue);
        return index > -1 ? races[index] : null;
    }
}
