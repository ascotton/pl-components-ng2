import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiNotesSchemasService {
    private notesSchemas: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('notesSchemas', params1).subscribe(
                (res: any) => {
                    this.notesSchemas = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(notesSchemas1: any = null) {
        const notesSchemas = notesSchemas1 || this.notesSchemas;
        if (this.notesSchemas && this.notesSchemas.length) {
            return notesSchemas.map((item: any) => {
                return { value: item.uuid, label: item.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, notesSchemas1: any[] = null) {
        const notesSchemas = notesSchemas1 || this.notesSchemas;
        const index = this.plLodash.findIndex(notesSchemas, key, keyValue);
        return index > -1 ? notesSchemas[index] : null;
    }
}
