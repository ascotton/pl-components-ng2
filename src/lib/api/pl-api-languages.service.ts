import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiLanguagesService {
    private languages: any[] = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('languages', params1).subscribe(
                (res: any) => {
                    this.languages = res;
                    observer.next(res);
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    formSelectOpts(languages1: any = null, skipCodes: string[] = []) {
        const languages = languages1 || this.languages;
        if (languages && languages.length) {
            const opts: any = [];
            languages.forEach((language: any) => {
                if (skipCodes.indexOf(language.code) < 0) {
                    opts.push({ value: language.code, label: language.name });
                }
            });
            return opts;
        }
        return [];
    }
    formOpts = this.formSelectOpts;

    getFromKey(key: string, keyValue: any, languages1: any[] = null) {
        const languages = languages1 || this.languages;
        const index = this.plLodash.findIndex(languages, key, keyValue);
        return index > -1 ? languages[index] : null;
    }

    getNameFromKey(key: string, keyValue: any, languages1: any[] = null) {
        const obj = this.getFromKey(key, keyValue, languages1);
        return obj && obj.name ? obj.name : '';
    }
}
