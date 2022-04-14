import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PLHttpStub {

    plUrls: {
        urls: {
        }
    }

    get(urlKey: string, data: any, url: string, options: any) {
        return new Observable((observer: any) => {
            observer.next(urlKey, data, url, options);
        });
    }
}