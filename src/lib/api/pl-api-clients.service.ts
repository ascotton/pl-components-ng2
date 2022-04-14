import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiClientsService {
    private clients: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}, options1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('clients', params1, '', options1).subscribe(
                (res: any) => {
                    this.clients = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(clients1: any = null) {
        const clients = clients1 || this.clients;
        if (this.clients && this.clients.length) {
            return clients.map((item: any) => {
                return { value: item.uuid, label: `${item.first_name} ${item.last_name}` };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, clients1: any[] = null) {
        const clients = clients1 || this.clients;
        const index = this.plLodash.findIndex(clients, key, keyValue);
        return index > -1 ? clients[index] : null;
    }

    formStatusSelectOpts() {
        return [
            { value: 'onboarding', label: 'Onboarding' },
            { value: 'in_service', label: 'In Service' },
            { value: 'not_in_service', label: 'Not In Service' },
        ];
    }

    formStatusSelectOptsGQL() {
        return [
            { value: 'ONBOARDING', label: 'Onboarding' },
            { value: 'IN_SERVICE', label: 'In Service' },
            { value: 'NOT_IN_SERVICE', label: 'Not In Service' },
        ];
    }

    save(client: any) {
        return this.plHttp.save('clients', client);
    }
}
