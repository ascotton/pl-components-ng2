import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiAccountDocumentTypesService {
    private documentTypes: any[] = [];

    constructor(
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService,
    ) {}

    get(params1: any = {}, options1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('accountDocumentTypes', params1, '', options1).subscribe(
                (res: any) => {
                    this.documentTypes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                },
            );
        });
    }

    formOpts(documentTypes1: any = null, valueKey: string = 'uuid') {
        const documentTypes = documentTypes1 || this.documentTypes;
        if (this.documentTypes && this.documentTypes.length) {
            return documentTypes.map((documentType: any) => {
                return { value: documentType[valueKey], label: documentType.name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, documentTypes1: any[] = null) {
        const documentTypes = documentTypes1 || this.documentTypes;
        const index = this.plLodash.findIndex(documentTypes, key, keyValue);
        return index > -1 ? documentTypes[index] : null;
    }

    getNameFromKey(key: string, keyValue: any, documentTypes1: any[] = null) {
        const obj = this.getFromKey(key, keyValue, documentTypes1);
        return obj && obj.name ? obj.name : '';
    }
}
