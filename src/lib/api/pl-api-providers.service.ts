import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiProvidersService {
    private providers: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}, options1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('providers', params1, '', options1).subscribe(
                (res: any) => {
                    this.providers = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }
}
