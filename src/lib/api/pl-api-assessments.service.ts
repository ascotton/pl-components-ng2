import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiAssessmentsService {
    private assessments: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('assessments', params1).subscribe(
                (res: any) => {
                    this.assessments = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formOpts(assessments1: any = null) {
        const assessments = assessments1 || this.assessments;
        if (this.assessments && this.assessments.length) {
            return assessments.map((item: any) => {
                let name = item.long_name || item.longName;
                return { value: item.uuid, label: name };
            });
        }
        return [];
    }

    getFromKey(key: string, keyValue: any, assessments1: any[] = null) {
        const assessments = assessments1 || this.assessments;
        const index = this.plLodash.findIndex(assessments, key, keyValue);
        return index > -1 ? assessments[index] : null;
    }

    getNamesFromIds(uuids: string[], assessments1: any[] = null) {
        const assessments = assessments1 || this.assessments;
        const names: string[] = [];
        if (uuids && uuids.length) {
            let index: number;
            uuids.forEach((uuid: string) => {
                index = this.plLodash.findIndex(assessments, 'uuid', uuid);
                if (index > -1) {
                    let name = assessments[index].long_name || assessments[index].longName;
                    names.push(name);
                }
            });
        }
        return names;
    }
}
