import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

let plApiServiceDocuments: any;

@Injectable()
export class PLApiServiceDocumentsService {
    private documentTypes: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {
        plApiServiceDocuments = this;
    }

    getTypes(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('documentTypes', params1).subscribe(
                (res: any) => {
                    this.documentTypes = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    save(doc: any, type: string) {
        return new Observable((observer: any) => {
            this.getTypes().subscribe(
                (types: any) => {
                    const index = this.plLodash.findIndex(types, 'code', type);
                    const typeUuid = index > -1 ? types[index].uuid : null;
                    if (!typeUuid) {
                        observer.error({ msg: 'Invalid type' });
                    } else {
                        const doc1 = Object.assign({}, doc, {
                            document_type: typeUuid,
                        });
                        this.plHttp.save('documents', doc1).subscribe(
                            (res: any) => {
                                observer.next(res.data);
                            },
                            (err: any) => {
                                observer.error(err);
                            }
                        );
                    }
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    delete(docUuid: string) {
        return this.plHttp.delete('documents', { uuid: docUuid });
    }

    deleteBulk(docUuids: string[]) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiServiceDocuments.plLodash.allTrue(loaded)) {
                    observer.next();
                }
            };

            docUuids.forEach((docUuid: string, index: number) => {
                loaded[index] = false;
                this.delete(docUuid).subscribe(
                    () => {
                        loaded[index] = true;
                        checkAllLoadedLocal();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            });
        });
    }
}
