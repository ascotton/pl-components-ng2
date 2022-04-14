import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiNomsService {
    private noms: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('noms', params1).subscribe(
                (res: any) => {
                    this.noms = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(noms1: any = null) {
        const noms = noms1 || this.noms;
        if (noms && noms.length) {
            return noms.map((nom: any) => {
                return { value: nom.uuid, label: nom.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, noms1: any[] = null) {
        const noms = noms1 || this.noms;
        const index = this.plLodash.findIndex(noms, key, keyValue);
        return index > -1 ? noms[index] : null;
    }

    expandClientNoms(clientNoms: any[], noms1: any[] = null) {
        const noms = noms1 || this.noms;
        let nom: any;
        let index: number;
        return clientNoms.map((clientNom: any) => {
            index = this.plLodash.findIndex(noms, 'uuid', clientNom.metric);
            return Object.assign({}, clientNom, {
                _nom: index > -1 ? noms[index] : {},
            });
        });
    }
}
